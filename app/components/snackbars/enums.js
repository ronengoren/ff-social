import {snackbarTypes} from '../../vars/enums';
import ChatSnackbar from './ChatSnackbar';
import SettingsSnackbar from './SettingsSnackbar';

export default {
  [snackbarTypes.CHAT]: ChatSnackbar,
  [snackbarTypes.SETTINGS]: SettingsSnackbar,
};
