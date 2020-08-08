import React, {Component} from 'react';
// import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
  DeviceEventEmitter,
  Linking,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
// import { extractBranchLinkData } from '/infra/utils/linkingUtils';
// import { branchSubscribePromise } from '/infra/referrerInfo';
import {omit} from './infra/utils';
import {refreshUserData, appendBranchDataToUser} from './redux/auth/actions';
// import {
//   ConnectionHeader,
//   ScreenErrorBoundary,
//   ActionSheetManager,
// } from './components';

import {Snackbar} from './components/snackbars';
import {FriendRequestLimitModal, CommunityRoleModal} from './components/modals';

import {
  screenNamesAliases,
  screenNamesWithTabNavigation,
  environmentTypes,
  screenNamesByUniversalLinks,
  screenNames,
} from './vars/enums';
import {AppTopNavigation} from './navigators';
// import { analytics, Logger } from '/infra/reporting';
// import ViewCountsService from '/infra/viewCounts';
import {
  user as userLocalStorage,
  medias as mediasCache,
  misc as miscLocalStorage,
} from './infra/localStorage';
// import * as pushManager from '/infra/pushNotifications';
import {navigationService} from './infra/navigation';
import I18n from '/infra/localization';

class App extends Component {
  state = {
    appState: 'active',
  };
  render() {
    return (
      <React.Fragment>
        <AppTopNavigation
          ref={(navigatorRef) => {
            navigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        <CommunityRoleModal />
        <FriendRequestLimitModal />
        <Snackbar />
      </React.Fragment>
    );
  }
  componentDidMount() {
    Orientation.lockToPortrait();
    AppState.addEventListener('change', this.handleAppStateChanged);
    DeviceEventEmitter.addListener('pushOpened', this.handlePushOpened);
    DeviceEventEmitter.addListener('pushReceived', this.handlePushReceived);
    Linking.addEventListener('url', ({url}) => {
      if (url) {
        this.handleUrl(url);
      } else {
        Logger.debug(`Linking url event - no URL passed to handleUrl`);
      }
    });

    Linking.getInitialURL().then((url) => url && this.handleUrl(url));
    SplashScreen.hide();

    mediasCache.init();
  }
  componentDidUpdate(prevProps) {
    if (Platform.OS === 'android' && this.props.user && !prevProps.user) {
      console.log('componentDidUpdate');
      // this.enablePushNotifications(); // In case an Android user installed the app and didn't pass threw register - we need to register him again to pushwoosh
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChanged);
  }
  handleUrl = (url) => {
    const {user} = this.props;
    const route = this.getRouteFromUrl(url);
    const screenIsInTopLevelRoutes = topLevelRoutes.includes(route.screenName);
    // if (this.isUniversalLink(url)) {
    //   analytics.lifecycleEvents.universalLinkOpened({ url, route }).dispatch();
    // }
    if (user || screenIsInTopLevelRoutes) {
      if (screenIsInTopLevelRoutes) {
        navigationService.goBack();
      }
      const firstNavigationScreenName =
        screenNamesWithTabNavigation[route.screenName];
      if (firstNavigationScreenName) {
        navigationService.navigate(firstNavigationScreenName, {});
      }
      navigationService.navigate(route.screenName, route.params, {
        noPush: false,
      });
    } else {
      navigationService.deferNavigation(route.screenName, route.params);
    }
  };
  handlePushReceived = () => {
    this.pushReceivedAndNotOpened = true;
  };

  handlePushOpened = (e) => {
    this.inactiveTimestamp = new Date(); // We dont want to navigate to the home page in this case...
    this.pushReceivedAndNotOpened = false;
    let pushEventData = omit(e, 'title');

    if (e && e.l) {
      const route = this.getRouteFromUrl(e.l);
      const {params, screenName} = route;
      pushEventData = Object.assign(pushEventData, {screenName, ...params});
      this.handleUrl(e.l);
    } else {
      console.debug(
        `handlePushOpened - no URL passed to handleUrl. e - ${
          e && JSON.stringify(e)
        }`,
      );
    }

    // analytics.lifecycleEvents.pushNotificationOpened(pushEventData).dispatch();
  };
  handleAppStateChanged = async (nextAppState) => {
    const {refreshUserData} = this.props;
    const user = await userLocalStorage.get();
    console.log(user);

    if (user) {
      if (
        this.state.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // resumeRecord();
        // analytics.lifecycleEvents.appOpened().dispatch();
        if (user && user.id && !(await miscLocalStorage.isNewUser())) {
          const currentTime = new Date();
          if (
            currentTime - this.inactiveTimestamp >
            INACTIVE_MINUTES_RESET * 60000
          ) {
            // There are cases where we receive a push but user is entering the app not via the push (example - badge update)
            // When a user is opening the app via push we get pushReceived and later pushOpened.
            // The logic below comes to prevent redirecting to home when the user enters the app from push.
            if (this.pushReceivedAndNotOpened) {
              setTimeout(() => {
                if (this.pushReceivedAndNotOpened) {
                  navigationService.resetToHomePage();
                }
              }, 300);
            } else {
              navigationService.resetToHomePage();
            }
          }
          refreshUserData();
          this.checkForCodePushUpdates();
        }
      } else if (
        this.state.appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // pauseRecord();
        // ViewCountsService.sendItems();
        this.inactiveTimestamp = new Date();
        // analytics.lifecycleEvents.appClosed().dispatch();
      }
    }
    this.setState({appState: nextAppState});
  };
  getRouteFromCustomUrl = (url) => {
    const params = {};
    const screenAndQuery = url.replace(/(^\w+:|^)\/\//, '').split('?');
    let screenName = screenAndQuery[0] || '';
    const query = screenAndQuery[1] || '';
    const queries = query ? query.split('&') : [];
    queries.forEach((query) => {
      const [key, entry] = query.split('=');
      params[key] = decodeURIComponent(entry);
    });

    if (params.screenName) {
      screenName = params.screenName;
    }

    return {
      screenName: screenNamesAliases[screenName] || screenName,
      params,
    };
  };

  getRouteFromUniversalLink = (url) => {
    const [urlWithoutQuery] = url.split('?');
    const urlSegments = urlWithoutQuery.split('/');
    const lastUrlSegment = urlSegments.pop();
    const screenName = urlSegments.pop();
    const entityId =
      screenName === screenNames.Chat
        ? lastUrlSegment
        : lastUrlSegment.split('-').pop();

    return {
      screenName: screenNamesByUniversalLinks[screenName],
      params: {
        entityId,
      },
    };
  };

  isUniversalLink = (url = '') => {
    const supportedDomains = [''];
    const domainMatch = url.match(/^https?:\/\/([^/]+)/);
    const domain = domainMatch && domainMatch[1];

    return supportedDomains.includes(domain);
  };

  getRouteFromUrl = (url) =>
    this.isUniversalLink(url)
      ? this.getRouteFromUniversalLink(url)
      : this.getRouteFromCustomUrl(url);
}

App.propTypes = {
  // appendBranchDataToUser: PropTypes.func,
  refreshUserData: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  inactiveTimestamp: state.auth.inactiveTimestamp,
});

const mapDispatchToProps = {
  refreshUserData,
  // appendBranchDataToUser
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
