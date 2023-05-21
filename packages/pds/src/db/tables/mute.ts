export const tableName = 'mute'
export const muteKeywordTableName = 'keyword_mute'

export interface Mute {
  did: string
  mutedByDid: string
  createdAt: string
}

export interface MuteKeyword {
  keyword: string
  mutedByDid: string
  createdAt: string
}

export type PartialDB = {
  [tableName]: Mute
  [muteKeywordTableName]: MuteKeyword
}
