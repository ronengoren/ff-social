import React, {Component} from 'react';
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
import {connect} from 'react-redux';
import {omit} from './infra/utils';

import {AppTopNavigation} from './navigators';
import {FriendRequestLimitModal, CommunityRoleModal} from './components/modals';
import {
  screenNamesAliases,
  screenNamesWithTabNavigation,
  environmentTypes,
  screenNamesByUniversalLinks,
  screenNames,
} from './vars/enums';
import {
  user as userLocalStorage,
  medias as mediasCache,
  misc as miscLocalStorage,
} from './infra/localStorage';
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
      </React.Fragment>
    );
  }
}

export default App;

//  <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeTab} />
//       </Stack.Navigator>
//     </NavigationContainer>
