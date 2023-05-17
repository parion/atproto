import { AtUri } from '@atproto/uri'
import skyline from './skyline'
import bskyTeam from './bsky-team'
import whatsHot from './whats-hot'
import whatsHotClassic from './whats-hot-classic'
import { ids } from '../lexicon/lexicons'
import { MountedAlgos } from './types'

const coll = ids.AppBskyFeedGenerator

// These are custom algorithms that will be mounted directly onto an AppView
// Feel free to remove, update to your own, or serve the following logic at a record that you control
export const makeAlgos = (did: string): MountedAlgos => ({
  [AtUri.make(did, coll, 'skyline').toString()]: skyline,
  [AtUri.make(did, coll, 'bsky-team').toString()]: bskyTeam,
  [AtUri.make(did, coll, 'whats-hot').toString()]: whatsHot,
  [AtUri.make(did, coll, 'whats-hot-classic').toString()]: whatsHotClassic,
})