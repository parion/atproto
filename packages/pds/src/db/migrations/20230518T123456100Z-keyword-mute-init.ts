import { Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('keyword_mute')
    .addColumn('keyword', 'varchar', (col) => col.notNull())
    .addColumn('mutedByDid', 'varchar', (col) => col.notNull())
    .addColumn('createdAt', 'varchar', (col) => col.notNull())
    .addPrimaryKeyConstraint('keyword_mute_pkey', ['mutedByDid', 'keyword'])
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('keyword_mute').execute()
}
