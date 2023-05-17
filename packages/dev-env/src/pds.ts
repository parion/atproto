import getPort from 'get-port'
import * as ui8 from 'uint8arrays'
import * as pds from '@atproto/pds'
import { Secp256k1Keypair } from '@atproto/crypto'
import { MessageDispatcher } from '@atproto/pds/src/event-stream/message-queue'
import { AtpAgent } from '@atproto/api'
import { Client as PlcClient } from '@did-plc/lib'
import { DAY, HOUR } from '@atproto/common-web'
import { PdsConfig } from './types'

export class TestPds {
  constructor(
    public url: string,
    public port: number,
    public server: pds.PDS,
  ) {}

  static async create(cfg: PdsConfig): Promise<TestPds> {
    const repoSigningKey = await Secp256k1Keypair.create()
    const plcRotationKey = await Secp256k1Keypair.create()
    const recoveryKey = await Secp256k1Keypair.create()

    const port = cfg.port || (await getPort())
    const url = `http://localhost:${port}`
    const plcClient = new PlcClient(cfg.plcUrl)

    const serverDid = await plcClient.createDid({
      signingKey: repoSigningKey.did(),
      rotationKeys: [recoveryKey.did(), plcRotationKey.did()],
      handle: 'pds.test',
      pds: `http://localhost:${port}`,
      signer: plcRotationKey,
    })

    const config = new pds.ServerConfig({
      debugMode: true,
      version: '0.0.0',
      scheme: 'http',
      port,
      hostname: 'localhost',
      serverDid,
      recoveryKey: recoveryKey.did(),
      adminPassword: 'admin-pass',
      inviteRequired: false,
      userInviteInterval: null,
      didPlcUrl: cfg.plcUrl,
      didCacheMaxTTL: DAY,
      didCacheStaleTTL: HOUR,
      jwtSecret: 'jwt-secret',
      availableUserDomains: ['.test'],
      appUrlPasswordReset: 'app://forgot-password',
      emailNoReplyAddress: 'noreply@blueskyweb.xyz',
      publicUrl: `http://localhost:${port}`,
      imgUriSalt: '9dd04221f5755bce5f55f47464c27e1e',
      imgUriKey:
        'f23ecd142835025f42c3db2cf25dd813956c178392760256211f9d315f8ab4d8',
      dbPostgresUrl: cfg.dbPostgresUrl,
      maxSubscriptionBuffer: 200,
      repoBackfillLimitMs: 1000 * 60 * 60, // 1hr
      labelerDid: 'did:example:labeler',
      labelerKeywords: { label_me: 'test-label', label_me_2: 'test-label-2' },
      ...cfg,
    })

    const blobstore = new pds.MemoryBlobStore()
    const db = config.dbPostgresUrl
      ? pds.Database.postgres({
          url: config.dbPostgresUrl,
          schema: config.dbPostgresSchema,
        })
      : pds.Database.memory()
    await db.migrateToLatestOrThrow()

    if (config.bskyAppViewEndpoint) {
      // Disable communication to app view within pds
      MessageDispatcher.prototype.send = async () => {}
    }

    const server = pds.PDS.create({
      db,
      blobstore,
      repoSigningKey,
      plcRotationKey,
      config,
    })

    await server.start()
    return new TestPds(url, port, server)
  }

  get ctx(): pds.AppContext {
    return this.server.ctx
  }

  getClient(): AtpAgent {
    return new AtpAgent({ service: `http://localhost:${this.port}` })
  }

  adminAuth(): string {
    return (
      'Basic ' +
      ui8.toString(
        ui8.fromString(`admin:${this.ctx.cfg.adminPassword}`, 'utf8'),
        'base64pad',
      )
    )
  }

  adminAuthHeaders() {
    return {
      authorization: this.adminAuth(),
    }
  }

  async close() {
    await this.server.destroy()
  }
}
