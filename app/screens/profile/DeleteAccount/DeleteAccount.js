import React from 'react';
import {StyleSheet} from 'react-native';
import I18n from '../../../infra/localization';
import {Header} from '../../../components';
import {View, Text, ScrollView} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import {screenNames} from '../../../vars/enums';
import {navigationService} from '../../../infra/navigation';
import ActionBox from './ActionBox';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  innerWrapper: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
  },
  deletionInfo: {
    marginTop: 15,
    marginBottom: 20,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  box: {
    minHeight: 80,
  },
});

class DeleteAccount extends React.Component {
  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <Header
          closeAction={navigationService.navigateBack}
          withShadow={false}
          withBorderBottom={false}
          hasBackButton
          searchMode={false}
          isHideSearch
        />
        <View style={styles.innerWrapper}>
          <View>
            <Text size={26} lineHeight={34} medium color={flipFlopColors.b30}>
              {I18n.t('profile.settings.delete_account.title')}
            </Text>
          </View>
          <View style={styles.deletionInfo}>
            <Text size={18} lineHeight={24} color={flipFlopColors.b70}>
              {I18n.t('profile.settings.delete_account.text')}
            </Text>
          </View>
          <View style={styles.actions}>
            <ActionBox
              borderColor={flipFlopColors.green}
              style={styles.box}
              title={I18n.t(
                'profile.settings.delete_account.disableNotifications.title',
              )}
              titleColor={flipFlopColors.green}
              text={I18n.t(
                'profile.settings.delete_account.disableNotifications.text',
              )}
              icons={['bell-slash']}
              onPress={this.navigateToturnOffFlags(['notifications'])}
            />
            <ActionBox
              borderColor={flipFlopColors.green}
              style={styles.box}
              title={I18n.t(
                'profile.settings.delete_account.disableNotificationsAndEmails.title',
              )}
              titleColor={flipFlopColors.green}
              text={I18n.t(
                'profile.settings.delete_account.disableNotificationsAndEmails.text',
              )}
              icons={['envelope-open-text', 'bell-slash']}
              onPress={this.navigateToturnOffFlags(['notifications', 'emails'])}
            />

            <ActionBox
              borderColor={flipFlopColors.red}
              style={styles.box}
              title={I18n.t('profile.settings.delete_account.delete.title')}
              titleColor={flipFlopColors.red}
              testID="deleteMyAccountBoxBtn"
              text={I18n.t('profile.settings.delete_account.delete.text')}
              icons={['heart-broken']}
              iconColor="red"
              boxColor={'#f8485d11'}
              onPress={this.navigateToUserDeletion}
              iconsColor="red"
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  navigateToturnOffFlags = (flags) => () =>
    navigationService.navigate(screenNames.DeleteAccountConfirmation, {
      turnOffFlags: flags,
    });

  navigateToUserDeletion = () =>
    navigationService.navigate(screenNames.DeleteAccountConfirmation, {
      deleteAccount: true,
    });
}

export default DeleteAccount;
