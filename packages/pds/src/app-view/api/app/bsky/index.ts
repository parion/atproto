import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'
import getTimeline from './feed/getTimeline'
import getAuthorFeed from './feed/getAuthorFeed'
import getLikes from './feed/getLikes'
import getPostThread from './feed/getPostThread'
import getPosts from './feed/getPosts'
import getProfile from './actor/getProfile'
import getProfiles from './actor/getProfiles'
import getRepostedBy from './feed/getRepostedBy'
import getFollowers from './graph/getFollowers'
import getFollows from './graph/getFollows'
import getList from './graph/getList'
import getListBlocks from './graph/getListBlocks'
import getLists from './graph/getLists'
import getBlocks from './graph/getBlocks'
import getUsersSearch from './actor/searchActors'
import getUsersTypeahead from './actor/searchActorsTypeahead'
import getSuggestions from './actor/getSuggestions'
import listNotifications from './notification/listNotifications'
import getUnreadCount from './notification/getUnreadCount'
import unspecced from './unspecced'

export default function (server: Server, ctx: AppContext) {
  getTimeline(server, ctx)
  getAuthorFeed(server, ctx)
  getLikes(server, ctx)
  getPostThread(server, ctx)
  getPosts(server, ctx)
  getProfile(server, ctx)
  getProfiles(server, ctx)
  getRepostedBy(server, ctx)
  getFollowers(server, ctx)
  getFollows(server, ctx)
  getList(server, ctx)
  getListBlocks(server, ctx)
  getLists(server, ctx)
  getBlocks(server, ctx)
  getUsersSearch(server, ctx)
  getUsersTypeahead(server, ctx)
  getSuggestions(server, ctx)
  listNotifications(server, ctx)
  getUnreadCount(server, ctx)
  unspecced(server, ctx)
}
