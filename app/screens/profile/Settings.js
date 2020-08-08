import React from 'react';
import PropTypes from 'prop-types';
// import codePush from 'react-native-code-push';
import {StyleSheet, TouchableOpacity, Linking} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { logout, changeFeatureFlag, updateUserLanguage } from '/redux/auth/actions';
// import { updateProfile, getProfile } from '/redux/profile/actions';
// import { openActionSheet } from '/redux/general/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
import {Screen} from '../../components';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TextButton,
  Spinner,
} from '../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {screenNames} from '../../vars/enums';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {get, isAppAdmin} from '../../infra/utils';

import {
  getVersionNumber,
  getVersionBuildNumber,
} from '../../infra/utils/deviceUtils';
import {navigationService} from '../../infra/navigation';
import {userScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  settingsChapterTitleWrapper: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.disabledGrey,
  },
  settingsChapterTitle: {
    fontSize: 20,
    lineHeight: 20,
    color: flipFlopColors.black,
  },
  settingsLine: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.disabledGrey,
  },
  settingsMultiLine: {
    width: '100%',
    height: 84,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.disabledGrey,
  },
  settingsRowFirstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
  },
  settingsRowSecondLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailVerificationIcon: {
    marginRight: 8,
  },
  settingsChapterSeparator: {
    width: '100%',
    height: 30,
    backgroundColor: flipFlopColors.fillGrey,
    borderWidth: 1,
    borderColor: flipFlopColors.disabledGrey,
  },
  leftText: {
    fontSize: 15,
    lineHeight: 22,
    color: flipFlopColors.black,
  },
  rightText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.4,
    textAlign: 'right',
    color: flipFlopColors.secondaryBlack,
  },
  settingRowArrow: {
    lineHeight: 22,
    paddingLeft: 5,
  },
  languageRightSection: {
    flexDirection: 'row',
  },
});

const FLIPFLOP_CONTACT_US_EMAIL = 'info@flipflop.com';

const checkStatusMessages = {
  CHECKING: 'Looking for update...',
  DOWNLOADING: 'Downloading update',
  AVAILABLE: 'Update available. Click to download',
  NO_UPDATE: 'No update available',
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const settings = get(props, 'data.settings', {});
    this.state = {
      form: {...settings, featureFlags: {...props.featureFlags}},
      isVerificationEmailSent: false,
      versionUpdateMessage: null,
    };
  }

  render() {
    const {data, logout} = this.props;
    const {form} = this.state;
    const versionNumber = getVersionNumber();

    if (!data) {
      return <Spinner />;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.innerContainer} testID="settingsScrollView">
          {this.renderChapterTitle({translationKey: 'general.header'})}
          {this.renderEmailRow()}
          {this.renderSettingsRow({
            translationKey: 'general.password',
            rightText: Array(8).fill(String.fromCharCode(8226)),
          })}
          <TouchableOpacity
            style={styles.settingsLine}
            onPress={this.handleLanguagePress}>
            <Text medium style={styles.leftText}>
              {I18n.t('profile.settings.general.language')}
            </Text>
            <View style={styles.languageRightSection}>
              <Text style={styles.rightText}>
                {I18n.getLanguageName(form.language)}
              </Text>
              <HomeisIcon
                name="right-arrow"
                size={20}
                color={flipFlopColors.black}
                style={styles.settingRowArrow}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.settingsChapterSeparator} />

          {this.renderChapterTitle({translationKey: 'notifications.header'})}
          {this.renderNotificationSettingsRow({
            translationKey: 'likes',
            stateKey: 'likes',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'comments',
            stateKey: 'comments',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'friend_requests',
            stateKey: 'friendRequests',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'ongoing_updates',
            stateKey: 'ongoingUpdates',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'messages',
            stateKey: 'messages',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'group_updates',
            stateKey: 'groups',
          })}
          {this.renderNotificationSettingsRow({
            translationKey: 'list_updates',
            stateKey: 'lists',
          })}
          <View style={styles.settingsChapterSeparator} />
          {this.renderChapterTitle({
            translationKey: 'emailNotifications.header',
          })}
          {this.renderNotificationSettingsRow({
            settingsSection: 'emailNotifications',
            translationKey: 'friend_requests',
            stateKey: 'friendRequests',
          })}
          {this.renderNotificationSettingsRow({
            settingsSection: 'emailNotifications',
            translationKey: 'messages',
            stateKey: 'unreadMessages',
          })}
          {this.renderNotificationSettingsRow({
            settingsSection: 'emailNotifications',
            translationKey: 'inactive_posts',
            stateKey: 'inactivePosts',
          })}
          <View style={styles.settingsChapterSeparator} />
          <View style={styles.settingsLine}>
            <Text medium style={styles.leftText}>
              {I18n.t('profile.settings.app_sounds')}
            </Text>
            <Switch
              active={form.enableSound}
              onChange={(val) => this.handleSettingsChange('enableSound', val)}
            />
          </View>
          <View style={styles.settingsChapterSeparator} />
          {!!get(data, 'connectedAccounts', []).length && (
            <View>
              {this.renderChapterTitle({
                translationKey: 'connected_accounts.header',
              })}
              {this.renderSettingsRow({
                translationKey: 'connected_accounts.users_button',
                onPress: this.navigateToConnectedAccounts,
                isWithArrow: true,
              })}
              {false && ( // TODO hidden until backend ready
                <View style={styles.settingsLine}>
                  <Text medium style={styles.leftText}>
                    Facebook
                  </Text>
                  <TextButton size="medium" onPress={() => {}}>
                    {I18n.t(
                      'profile.settings.connected_accounts.connect_button',
                    )}
                  </TextButton>
                </View>
              )}
              <View style={styles.settingsChapterSeparator} />
            </View>
          )}

          {this.renderChapterTitle({translationKey: 'legal.header'})}
          {this.renderSettingsRow({
            translationKey: 'legal.privacy_policy',
            onPress: this.navigateToPrivacyPolicy,
            isWithArrow: true,
          })}
          {this.renderSettingsRow({
            translationKey: 'legal.terms_of_service',
            onPress: this.navigateToTermsAndConditions,
            isWithArrow: true,
          })}
          <View style={styles.settingsChapterSeparator} />

          <View>
            <View medium style={styles.settingsChapterTitleWrapper}>
              <Text style={styles.settingsChapterTitle}>
                {I18n.t('profile.settings.feature_flags.header')}
              </Text>
            </View>
            {this.renderFeatureFlagRow({
              translationKey: 'referral_program',
              stateKey: 'enableReferralProgram',
            })}
            {this.renderFeatureFlagRow({
              translationKey: 'feeds_for_admins',
              stateKey: 'feedsForAdmins',
            })}
            {this.renderFeatureFlagRow({
              translationKey: 'disable_rich_text_editor',
              stateKey: 'disableRichTextEditor',
            })}
            <View style={styles.settingsChapterSeparator} />
          </View>

          {this.renderSettingsRow({
            translationKey: 'app_version',
            rightText: versionNumber,
          })}
          {this.renderBuildVersionRow()}
          <View style={styles.settingsChapterSeparator} />
          {this.renderSettingsRow({
            translationKey: 'contact_us_button',
            onPress: this.openContactUsMail,
            isWithArrow: true,
          })}

          {this.renderSettingsRow({
            translationKey: 'delete_account_button',
            onPress: this.navigateToDeleteAccount,
            textProps: {
              size: 15,
              lineHeight: 22,
              color: flipFlopColors.red,
              testID: 'deleteAccountBtn',
            },
          })}

          {this.renderSettingsRow({
            translationKey: 'sign_out_button',
            onPress: logout,
            textProps: {size: 15, lineHeight: 22, color: flipFlopColors.red},
          })}
        </ScrollView>
      </View>
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.prevData && props.data) {
      return {
        form: {...state.form, ...props.data.settings},
        prevData: props.data,
      };
    }
    return null;
  }

  //   componentDidMount = async () => {
  //     const { getProfile, user, data } = this.props;

  //     if (!data) {
  //       try {
  //         await getProfile({ userId: user.id });
  //       } catch (err) {
  //         this.setState({ throwError: err }); // eslint-disable-line react/no-did-mount-set-state
  //       }
  //     }
  //   };

  componentDidUpdate() {
    if (this.state.throwError) {
      throw this.state.throwError;
    }
  }

  renderChapterTitle = ({translationKey}) => (
    <View style={styles.settingsChapterTitleWrapper}>
      <Text medium style={styles.settingsChapterTitle}>
        {I18n.t(`profile.settings.${translationKey}`)}
      </Text>
    </View>
  );

  renderSettingsRow = ({
    translationKey,
    onPress = () => {},
    textProps = {},
    isWithArrow = false,
    rightText,
  }) => (
    <TouchableOpacity
      style={styles.settingsLine}
      onPress={onPress}
      activeOpacity={1}>
      <Text medium {...textProps}>
        {I18n.t(`profile.settings.${translationKey}`)}
      </Text>
      {!!rightText && <Text style={styles.rightText}>{rightText}</Text>}
      {isWithArrow && (
        <HomeisIcon
          name="right-arrow"
          size={20}
          color={flipFlopColors.black}
          style={styles.settingRowArrow}
        />
      )}
    </TouchableOpacity>
  );

  renderNotificationSettingsRow = ({
    settingsSection = 'notifications',
    translationKey,
    stateKey,
  }) => {
    const {form} = this.state;
    const settings = form[settingsSection] || {};
    return (
      <View style={styles.settingsLine}>
        <Text medium style={styles.leftText}>
          {I18n.t(`profile.settings.${settingsSection}.${translationKey}`)}
        </Text>
        <Switch
          active={settings[stateKey]}
          onChange={(val) =>
            this.handleNotificationsChange({
              settingsSection,
              prop: stateKey,
              val,
            })
          }
        />
      </View>
    );
  };

  renderFeatureFlagRow = ({translationKey, stateKey}) => {
    const {form} = this.state;
    return (
      <View style={styles.settingsLine}>
        <Text medium style={styles.leftText}>
          {I18n.t(`profile.settings.feature_flags.${translationKey}`)}
        </Text>
        <Switch
          active={form.featureFlags[stateKey]}
          onChange={(val) => this.handleFeatureFlagChange(stateKey, val)}
        />
      </View>
    );
  };

  renderEmailRow = () => {
    const {isVerificationEmailSent} = this.state;
    const {data} = this.props;
    const {email, isEmailVerified} = data.user;
    let secondRowText = '';
    let secondRowColor;
    let secondRowIcon;
    let action = () => {};
    if (isEmailVerified) {
      secondRowText = I18n.t(
        `profile.settings.general.email_verification.verified`,
      );
      secondRowColor = flipFlopColors.green;
      secondRowIcon = 'check-circle';
    } else {
      secondRowText = isVerificationEmailSent
        ? I18n.t(
            `profile.settings.general.email_verification.verification_sent`,
          )
        : I18n.t(`profile.settings.general.email_verification.non_verified`);
      secondRowColor = isVerificationEmailSent
        ? flipFlopColors.b70
        : flipFlopColors.red;
      secondRowIcon = isVerificationEmailSent
        ? 'arrow-alt-circle-right'
        : 'exclamation-circle';
      action = isVerificationEmailSent ? () => {} : this.verifyEmail;
    }

    return (
      <View style={styles.settingsMultiLine}>
        <TouchableOpacity
          style={styles.settingsRowFirstLine}
          activeOpacity={1}
          onPress={this.navigateToChangeEmail}>
          <Text medium>{I18n.t(`profile.settings.general.email`)}</Text>
          <View style={commonStyles.flexDirectionRow}>
            <Text style={styles.rightText}>{email}</Text>
            <HomeisIcon
              name="right-arrow"
              size={20}
              color={flipFlopColors.black}
              style={styles.settingRowArrow}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsRowSecondLine}
          activeOpacity={1}
          onPress={action}>
          <AwesomeIcon
            name={secondRowIcon}
            size={13}
            color={secondRowColor}
            weight="solid"
            style={styles.emailVerificationIcon}
          />
          <Text size={15} color={secondRowColor}>
            {secondRowText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderBuildVersionRow = () => {
    const {versionUpdateMessage} = this.state;
    const buildVersion = getVersionBuildNumber();

    return (
      <TouchableOpacity
        style={
          versionUpdateMessage ? styles.settingsMultiLine : styles.settingsLine
        }
        activeOpacity={1}
        onPress={this.manageUpdateState}>
        <View style={styles.settingsRowFirstLine}>
          <Text medium>{I18n.t(`profile.settings.build_version`)}</Text>
          <View>
            <Text style={styles.rightText}>{buildVersion}</Text>
          </View>
        </View>
        {!!versionUpdateMessage && (
          <View style={styles.settingsRowSecondLine}>
            <Text size={15} color={flipFlopColors.pinkishRed}>
              {versionUpdateMessage}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  openContactUsMail = () => {
    const {data} = this.props;
    const {communityManagerEmail} = data.user;
    Linking.openURL(
      `mailto:${communityManagerEmail}?cc=${FLIPFLOP_CONTACT_US_EMAIL}&subject=Hi, FlipFlops`,
    );
  };

  navigateToTermsAndConditions = () => {
    navigationService.navigate(screenNames.WebView, {
      url: 'https://www.flipflop.com/terms',
    });
  };

  navigateToDeleteAccount = () => {
    navigationService.navigate(screenNames.DeleteAccount);
  };

  navigateToPrivacyPolicy = () => {
    navigationService.navigate(screenNames.WebView, {
      url: 'https://www.flipflop.com/privacy',
    });
  };

  handleNotificationsChange = ({
    settingsSection = 'notifications',
    prop,
    val,
  }) => {
    // // non-generic solution due to nested object requirement. extend upon demand
    // const { updateProfile, data } = this.props;
    // const { form } = this.state;
    // this.setState({ form: { ...form, [settingsSection]: { ...form[settingsSection], [prop]: val } } }, () => {
    //   const { form } = this.state;
    //   updateProfile({ userId: data.user.id, delta: { settings: form } });
    // });
  };

  handleSettingsChange = (prop, val) => {
    // const { updateProfile, data } = this.props;
    // const { form } = this.state;
    // const updatedForm = { ...form };
    // updatedForm[prop] = val;
    // this.setState({ form: updatedForm }, () => {
    //   const { form } = this.state;
    //   updateProfile({ userId: data.user.id, delta: { settings: form } });
    // });
  };

  handleFeatureFlagChange = (flag, flagState) => {
    // const { changeFeatureFlag } = this.props;
    // changeFeatureFlag({ flag, flagState });
  };

  handleLanguagePress = () => {
    // const { openActionSheet } = this.props;
    // const data = {
    //   options: I18n.languagesDescriptorArray.map((language) => ({
    //     ...language,
    //     shouldClose: true,
    //     action: () => this.handleLanguageChange(language.id)
    //   })),
    //   hasCancelButton: true
    // };
    // openActionSheet(data);
  };

  handleLanguageChange = (newLanguage) => {
    // const { form } = this.state;
    // const { updateProfile, updateUserLanguage, data, navigation } = this.props;
    // const newForm = { ...form, language: newLanguage };
    // this.setState({ form: newForm }, () => {
    //   updateProfile({ userId: data.user.id, delta: { settings: newForm } });
    //   I18n.changeUserLocalization({ locale: newLanguage });
    //   updateUserLanguage({ locale: newLanguage });
    //   // in order to re-render navigation header which will update the header's title
    //   navigation.setParams({});
    // });
  };

  verifyEmail = () => {
    // const { apiCommand, data } = this.props;
    // const { email } = data.user;
    // apiCommand('users.verifyEmail', { emailToValidate: email });
    // this.setState({ isVerificationEmailSent: true });
  };

  navigateToChangeEmail = () => {
    navigationService.navigate('ChangeEmail');
  };

  navigateToConnectedAccounts = () => {
    const {data} = this.props;
    const {
      connectedAccounts = [],
      settings: {enableSound = true},
    } = data;
    if (connectedAccounts.length) {
      navigationService.navigate(screenNames.ConnectedUsersList, {
        connectedAccounts,
        isSoundEnabled: enableSound,
      });
    }
  };

  manageUpdateState = () => {
    const {versionUpdateMessage} = this.state;
    if (versionUpdateMessage === checkStatusMessages.AVAILABLE) {
      this.downloadUpdate();
    } else {
      this.checkForUpdate();
    }
  };

  downloadUpdate() {
    // this.setState({versionUpdateMessage: checkStatusMessages.DOWNLOADING});
    // codePush.sync({
    //   updateDialog: true,
    //   installMode: codePush.InstallMode.IMMEDIATE,
    //   deploymentKey: process.env.CODEPUSH_DEPLOYMENT_KEY,
    // });
  }

  async checkForUpdate() {
    // this.setState({versionUpdateMessage: checkStatusMessages.CHECKING});
    // const res = await codePush.checkForUpdate(
    //   process.env.CODEPUSH_DEPLOYMENT_KEY,
    // );
    // if (res) {
    //   this.setState({versionUpdateMessage: checkStatusMessages.AVAILABLE});
    // } else {
    //   this.setState({versionUpdateMessage: checkStatusMessages.NO_UPDATE});
    // }
  }
}

Settings.propTypes = {
  navigation: PropTypes.object,
  featureFlags: PropTypes.object,
  //   logout: PropTypes.func,
  //   updateProfile: PropTypes.func,
  //   getProfile: PropTypes.func,
  //   changeFeatureFlag: PropTypes.func,
  //   openActionSheet: PropTypes.func,
  //   updateUserLanguage: PropTypes.func,
  //   apiCommand: PropTypes.func,
  // data: PropTypes.shape({
  //   settings: PropTypes.object,
  //   connectedAccounts: PropTypes.array,
  //   user: PropTypes.object,
  // }),
  user: userScheme,
  communityManagerEmail: PropTypes.string,
};

const mapDispatchToProps = {
  //   logout,
  //   updateProfile,
  //   getProfile,
  //   changeFeatureFlag,
  //   openActionSheet,
  //   updateUserLanguage,
  //   apiCommand
};

const mapStateToProps = (state) => {
  // const {user} = state.auth;
  // return {
  //   featureFlags: state.auth.featureFlags,
  //   data: get(state, `profile[${user.id}].data`),
  //   user,
  // };
};

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);
export default Screen({modalError: true})(Settings);
