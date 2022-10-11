import { sql } from 'kysely'
import { Server } from '../../../lexicon'
import * as GetRepostedBy from '../../../lexicon/types/todo/social/getRepostedBy'
import * as locals from '../../../locals'
import { paginate } from '../../../db/util'

export default function (server: Server) {
  server.todo.social.getRepostedBy(
    async (params: GetRepostedBy.QueryParams, _input, _req, res) => {
      const { uri, limit, before } = params
      const { db } = locals.get(res)

      let builder = db.db
        .selectFrom('todo_social_repost as repost')
        .where('repost.subject', '=', uri)
        .innerJoin('record', 'repost.uri', 'record.uri')
        .innerJoin('user', 'repost.creator', 'user.did')
        .leftJoin(
          'todo_social_profile as profile',
          'profile.creator',
          'user.did',
        )
        .select([
          'user.did as did',
          'user.username as name',
          'profile.displayName as displayName',
          'repost.createdAt as createdAt',
          'record.indexedAt as indexedAt',
        ])

      builder = paginate(builder, {
        limit,
        before,
        by: sql`repost.createdAt`,
      })

      const repostedByRes = await builder.execute()

      const repostedBy = repostedByRes.map((row) => ({
        did: row.did,
        name: row.name,
        displayName: row.displayName || undefined,
        createdAt: row.createdAt,
        indexedAt: row.indexedAt,
      }))

      return {
        encoding: 'application/json',
        body: {
          uri,
          repostedBy,
        },
      }
    },
  )
}
