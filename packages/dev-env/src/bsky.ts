import getPort from 'get-port'
import * as bsky from '@atproto/bsky'
import { DAY, HOUR } from '@atproto/common-web'
import { AtpAgent } from '@atproto/api'
import { Secp256k1Keypair } from '@atproto/crypto'
import { Client as PlcClient } from '@did-plc/lib'
import { BskyConfig } from './types'

export class TestBsky {
  constructor(
    public url: string,
    public port: number,
    public server: bsky.BskyAppView,
  ) {}

  static async create(cfg: BskyConfig): Promise<TestBsky> {
    const serviceKeypair = await Secp256k1Keypair.create()
    const plcClient = new PlcClient(cfg.plcUrl)

    const port = cfg.port || (await getPort())
    const url = `http://localhost:${port}`
    const serverDid = await plcClient.createDid({
      signingKey: serviceKeypair.did(),
      rotationKeys: [serviceKeypair.did()],
      handle: 'bsky.test',
      pds: `http://localhost:${port}`,
      signer: serviceKeypair,
    })

    const config = new bsky.ServerConfig({
      version: '0.0.0',
      port,
      didPlcUrl: cfg.plcUrl,
      publicUrl: 'https://bsky.public.url',
      serverDid,
      imgUriSalt: '9dd04221f5755bce5f55f47464c27e1e',
      imgUriKey:
        'f23ecd142835025f42c3db2cf25dd813956c178392760256211f9d315f8ab4d8',
      didCacheStaleTTL: HOUR,
      didCacheMaxTTL: DAY,
      ...cfg,
      // Each test suite gets its own lock id for the repo subscription
      repoSubLockId: uniqueLockId(),
      adminPassword: 'admin-pass',
      labelerDid: 'did:example:labeler',
      labelerKeywords: { label_me: 'test-label', label_me_2: 'test-label-2' },
    })

    const db = bsky.Database.postgres({
      url: cfg.dbPostgresUrl,
      schema: cfg.dbPostgresSchema,
    })

    // Separate migration db in case migration changes some connection state that we need in the tests, e.g. "alter database ... set ..."
    const migrationDb = bsky.Database.postgres({
      url: cfg.dbPostgresUrl,
      schema: cfg.dbPostgresSchema,
    })
    if (cfg.migration) {
      await migrationDb.migrateToOrThrow(cfg.migration)
    } else {
      await migrationDb.migrateToLatestOrThrow()
    }
    await migrationDb.close()

    const server = bsky.BskyAppView.create({ db, config })
    await server.start()
    const sub = server.sub
    if (!sub) {
      throw new Error('No appview sub setup')
    }
    return new TestBsky(url, port, server)
  }

  get ctx(): bsky.AppContext {
    return this.server.ctx
  }

  get sub() {
    if (!this.server.sub) {
      throw new Error('No subscription on dev-env server')
    }
    return this.server.sub
  }

  getClient() {
    return new AtpAgent({ service: this.url })
  }

  async close() {
    await this.server.destroy()
  }
}

const usedLockIds = new Set()
const uniqueLockId = () => {
  let lockId: number
  do {
    lockId = 1000 + Math.ceil(1000 * Math.random())
  } while (usedLockIds.has(lockId))
  usedLockIds.add(lockId)
  return lockId
}
