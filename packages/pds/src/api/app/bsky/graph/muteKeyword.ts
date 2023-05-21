import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.graph.muteKeyword({
    auth: ctx.accessVerifier,
    handler: async ({ auth, input }) => {
      // const { actor } = input.body
      const requester = auth.credentials.did
      const { db, services } = ctx

      // const subject = await services.appView.graph(db).getMutedKeywords(requester)
      // if (!subject) {
      //   throw new InvalidRequestError(`Actor not found: ${actor}`)
      // }

      await services.appView.graph(db).muteKeyword({
        keyword: 'string',
        mutedByDid: requester,
      })
    },
  })
}
