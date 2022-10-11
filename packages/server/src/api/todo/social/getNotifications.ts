import { sql } from 'kysely'
import { Server } from '../../../lexicon'
import { AuthRequiredError, InvalidRequestError } from '@adxp/xrpc-server'
import * as GetNotifications from '../../../lexicon/types/todo/social/getNotifications'
import * as locals from '../../../locals'
import { paginate } from '../../../db/util'

export default function (server: Server) {
  server.todo.social.getNotifications(
    async (params: GetNotifications.QueryParams, _input, req, res) => {
      const { limit, before } = params

      const { auth, db } = locals.get(res)
      const requester = auth.getUserDid(req)
      if (!requester) {
        throw new AuthRequiredError()
      }

      let notifBuilder = db.db
        .selectFrom('user_notification as notif')
        .where('notif.userDid', '=', requester)
        .innerJoin('record', 'record.uri', 'notif.recordUri')
        .innerJoin('user as author', 'author.did', 'notif.author')
        .leftJoin(
          'todo_social_profile as author_profile',
          'author_profile.creator',
          'author.did',
        )
        .select([
          'notif.recordUri as uri',
          'author.did as authorDid',
          'author.username as authorName',
          'author_profile.displayName as authorDisplayName',
          'notif.reason as reason',
          'notif.reasonSubject as reasonSubject',
          'notif.indexedAt as createdAt',
          'record.raw as record',
          'record.indexedAt as indexedAt',
          'notif.recordUri as uri',
        ])

      notifBuilder = paginate(notifBuilder, {
        before,
        limit,
        by: sql`notif.indexedAt`,
      })

      const [user, notifs] = await Promise.all([
        db.db
          .selectFrom('user')
          .selectAll()
          .where('did', '=', requester)
          .executeTakeFirst(),
        notifBuilder.execute(),
      ])

      if (!user) {
        throw new InvalidRequestError(`Could not find user: ${requester}`)
      }

      const notifications = notifs.map((notif) => ({
        uri: notif.uri,
        author: {
          did: notif.authorDid,
          name: notif.authorName,
          displayName: notif.authorDisplayName || undefined,
        },
        reason: notif.reason,
        reasonSubject: notif.reasonSubject || undefined,
        record: JSON.parse(notif.record),
        isRead: notif.createdAt <= user.lastSeenNotifs,
        indexedAt: notif.indexedAt,
        // @TODO do we need createdAt so that it can be used as a cursor?
      }))
      return {
        encoding: 'application/json',
        body: { notifications },
      }
    },
  )
}
