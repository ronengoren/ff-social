import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View, Text} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {BaseHeaderSnackbar} from '../snackbars';
import {userScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.green,
  },
  text: {
    textAlign: 'center',
    color: flipFlopColors.white,
    letterSpacing: 0.2,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.white,
    borderRadius: 18,
    marginRight: 8,
  },
});

class SettingsSnackbar extends Component {
  render() {
    const {hideCurrentSnackbar} = this.props;
    return (
      <BaseHeaderSnackbar
        onPress={hideCurrentSnackbar}
        hideCloseButton
        style={styles.wrapper}
        {...this.props}>
        <View style={styles.headerTitle}>
          <View style={styles.circle}>
            <AwesomeIcon
              name="check"
              weight="solid"
              color={flipFlopColors.green}
              size={13}
            />
          </View>
          <Text size={16} lineHeight={20} bold style={styles.text}>
            {I18n.t('profile.settings.settings_updated_snackbar')}
          </Text>
        </View>
      </BaseHeaderSnackbar>
    );
  }
}

SettingsSnackbar.propTypes = {
  user: userScheme,
  hideCurrentSnackbar: PropTypes.func,
};

export default SettingsSnackbar;
