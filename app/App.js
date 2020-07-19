import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import React, {Component} from 'react';
import {AppTopNavigation} from './navigators';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <AppTopNavigation />
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
