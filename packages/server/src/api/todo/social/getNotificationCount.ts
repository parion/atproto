import { Server } from '../../../lexicon'
import { AuthRequiredError } from '@adxp/xrpc-server'
import * as GetNotificationCount from '../../../lexicon/types/todo/social/getNotificationCount'
import * as locals from '../../../locals'
import { countClause } from '../../../db/util'

export default function (server: Server) {
  server.todo.social.getNotificationCount(
    async (params: GetNotificationCount.QueryParams, _input, req, res) => {
      const { auth, db } = locals.get(res)
      const requester = auth.getUserDid(req)
      if (!requester) {
        throw new AuthRequiredError()
      }

      const result = await db.db
        .selectFrom('user_notification as notif')
        .select(countClause.as('count'))
        .innerJoin('user', 'notif.userDid', 'user.did')
        .where('user.did', '=', requester)
        .whereRef('notif.indexedAt', '>', 'user.lastSeenNotifs')
        .executeTakeFirst()

      const count = result?.count ?? 0

      return {
        encoding: 'application/json',
        body: { count },
      }
    },
  )
}
