import '@babel/polyfill';
import 'proxy-polyfill';
import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import I18n from './app/infra/localization';
import Root from './app/Root';
import {name as appName} from './app.json';

I18n.init();

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => Root);
