import {combineReducers} from 'redux';
import apiQuery from './apiQuery/reducer';
import newsFeed from './newsFeed/reducer';
import neighborhoodFeed from './neighborhoodFeed/reducer';
import communityFeed from './communityFeed/reducer';
import entityFeed from './entityFeed/reducer';
import profile from './profile/reducer';
import friendships from './friendships/reducer';
import apiCommands from './apiCommands/reducer';
import auth from './auth/reducer';
import navState from './navigator/reducer';
import uploads from './uploads/reducer';
import postPage from './postPage/reducer';
import infiniteScroll from './InfiniteScroll/reducer';
import pages from './pages/reducer';
import results from './results/reducer';
import groups from './groups/reducer';
import notifications from './notifications/reducer';
import inbox from './inbox/reducer';
import urlScraping from './urlScraping/reducer';
import search from './search/reducer';
import searchAddress from './/searchAddress/reducer';
import events from './events/reducer';
import mentions from './mentions/reducer';
import users from './users/reducer';
import suggestedItems from './suggestedItems/reducer';
import lists from './lists/reducer';
import general from './general/reducer';
import comments from './comments/reducer';
import themes from './themes/reducer';
import neighborhoods from './neighborhoods/reducer';
import posts from './posts/reducer';
import scheduledPosts from './scheduledPosts/reducer';
import solutions from './solutions/reducer';
import personalizedFeed from './personalizedFeed/reducer';
import stories from './stories/reducer';
import {LOGOUT_SUCCESS} from './auth/actions';

const reduceReducers = (...reducers) => (previous, action) =>
  reducers.reduce(
    (currentState, currentReducer) => currentReducer(currentState, action),
    previous,
  );

const configureReducer = () => {
  const appReducer = reduceReducers(
    combineReducers({
      apiCommands,
      auth,
      comments,
      communityFeed,
      entityFeed,
      events,
      friendships,
      groups,
      inbox,
      general,
      lists,
      mentions,
      navState,
      neighborhoods,
      neighborhoodFeed,
      newsFeed,
      notifications,
      pages,
      personalizedFeed,
      posts,
      postPage,
      profile,
      results,
      search,
      searchAddress,
      suggestedItems,
      themes,
      uploads,
      urlScraping,
      users,
      scheduledPosts,
      solutions,
      stories,
    }),
    apiQuery,
    infiniteScroll,
  );

  const reducer = (state, action) =>
    appReducer(action.type === LOGOUT_SUCCESS ? undefined : state, action);

  return reducer;
};

export default configureReducer;
