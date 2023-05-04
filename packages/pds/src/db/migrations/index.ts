// NOTE this file can be edited by hand, but it is also appended to by the migration:create command.
// It's important that every migration is exported from here with the proper name. We'd simplify
// this with kysely's FileMigrationProvider, but it doesn't play nicely with the build process.

export * as _20221021T162202001Z from './20221021T162202001Z-init'
export * as _20221116T234458063Z from './20221116T234458063Z-duplicate-records'
export * as _20221202T212459280Z from './20221202T212459280Z-blobs'
export * as _20221209T210026294Z from './20221209T210026294Z-banners'
export * as _20221212T195416407Z from './20221212T195416407Z-post-media'
export * as _20221215T220356370Z from './20221215T220356370Z-password-reset-otp'
export * as _20221226T213635517Z from './20221226T213635517Z-mute-init'
export * as _20221230T215012029Z from './20221230T215012029Z-moderation-init'
export * as _20230127T215753149Z from './20230127T215753149Z-indexed-at-on-record'
export * as _20230127T224743452Z from './20230127T224743452Z-repo-sync-data-pt1'
export * as _20230201T200606704Z from './20230201T200606704Z-repo-sync-data-pt2'
export * as _20230202T170426672Z from './20230202T170426672Z-user-partitioned-cids'
export * as _20230202T170435937Z from './20230202T170435937Z-delete-account-token'
export * as _20230202T172831900Z from './20230202T172831900Z-moderation-subject-blob'
export * as _20230202T213952826Z from './20230202T213952826Z-repo-seq'
export * as _20230208T081544325Z from './20230208T081544325Z-post-hydrate-indices'
export * as _20230208T222001557Z from './20230208T222001557Z-user-table-did-pkey'
export * as _20230210T210132396Z from './20230210T210132396Z-post-hierarchy'
export * as _20230214T172233550Z from './20230214T172233550Z-embed-records'
export * as _20230301T222603402Z from './20230301T222603402Z-repo-ops'
export * as _20230304T193548198Z from './20230304T193548198Z-pagination-indices'
export * as _20230308T234640077Z from './20230308T234640077Z-record-indexes'
export * as _20230309T012947663Z from './20230309T012947663Z-app-migration'
export * as _20230310T205728933Z from './20230310T205728933Z-subscription-init'
export * as _20230313T232322844Z from './20230313T232322844Z-blob-creator'
export * as _20230314T023842127Z from './20230314T023842127Z-refresh-grace-period'
export * as _20230323T162732466Z from './20230323T162732466Z-remove-scenes'
export * as _20230328T214311000Z from './20230328T214311000Z-remove-declarations-assertions-confirmations'
export * as _20230328T214311001Z from './20230328T214311001Z-votes-to-likes'
export * as _20230328T214311002Z from './20230328T214311002Z-remove-post-entities'
export * as _20230328T214311003Z from './20230328T214311003Z-backlinks'
export * as _20230328T214311004Z from './20230328T214311004Z-profile-display-name-empty'
export * as _20230328T214311005Z from './20230328T214311005Z-rework-seq'
export * as _20230406T185855842Z from './20230406T185855842Z-feed-item-init'
export * as _20230411T175730759Z from './20230411T175730759Z-drop-message-queue'
export * as _20230411T180247652Z from './20230411T180247652Z-labels'
export * as _20230412T231807162Z from './20230412T231807162Z-moderation-action-labels'
export * as _20230416T221236745Z from './20230416T221236745Z-app-specific-passwords'
export * as _20230420T143821201Z from './20230420T143821201Z-post-profile-aggs'
export * as _20230427T194652255Z from './20230427T194652255Z-notif-record-index'
export * as _20230428T195614638Z from './20230428T195614638Z-actor-block-init'
export * as _20230504T210229992Z from './20230504T210229992Z-record-embed-block'
