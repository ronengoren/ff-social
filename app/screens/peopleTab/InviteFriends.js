import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Linking,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  Share,
} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {View, Text, Image, ScrollView} from '../../components/basicComponents';
import {Screen} from '../../components';
import {ReferralProgramAnnotation} from '../../components/people';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import images from '../../assets/images';
import {AwesomeIcon} from '../../assets/icons';
// import { Logger, analytics } from '/infra/reporting';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {downloadLinks, userInviteMethods} from '../../vars/enums';

import ReferralExplanationModal from './ReferralProgramExplanationModal';
import ShareLink from './ShareLink';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  containerSmallScreen: {
    paddingTop: 15,
  },
  header: {
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  invitations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  invitationsSmallScreen: {
    marginTop: 15,
  },
  invitation: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    padding: 10,
    marginBottom: 15,
    borderRadius: 15,
  },
  invitationWithMargin: {
    marginRight: 15,
  },
  invitationImage: {
    height: 46,
    width: 46,
  },
  invitationSmsIcon: {
    marginTop: 4,
  },
  invitationEmailIcon: {
    marginTop: 3,
  },
  invitationMoreIcon: {
    marginTop: 6,
  },
  invitationText: {
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  referralStatusLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  referralStatusIcon: {
    marginLeft: 10,
  },
});

const invitations = [
  {
    method: 'whatsapp',
    image: (
      <Image style={styles.invitationImage} source={images.invite.whatsapp} />
    ),
    actionSuffix: 'sendInviteViaWhatsapp',
    textSpace: 5,
  },
  {
    method: 'text',
    image: (
      <AwesomeIcon
        name="comments-alt"
        weight="solid"
        size={36}
        color={flipFlopColors.pinkishRed}
        style={styles.invitationSmsIcon}
      />
    ),
    actionSuffix: 'sendInviteViaText',
    textSpace: 9,
  },
  {
    method: 'email',
    image: (
      <AwesomeIcon
        name="envelope"
        weight="solid"
        size={36}
        color={flipFlopColors.golden}
        style={styles.invitationEmailIcon}
      />
    ),
    actionSuffix: 'sendInviteViaEmail',
    textSpace: 8,
  },
  {
    method: 'more',
    image: (
      <AwesomeIcon
        name="plus"
        weight="solid"
        size={29}
        color={flipFlopColors.b30}
        style={styles.invitationMoreIcon}
      />
    ),
    actionSuffix: 'sendInviteViaNativeDrawer',
    textSpace: 10,
  },
];
const ios = Platform.OS === 'ios';

class InviteFriends extends React.Component {
  state = {
    isReferralExplanationModalShown: false,
  };

  render() {
    const {isReferralExplanationModalShown} = this.state;
    // const {featureFlags, refProgram} = this.props;
    // const {
    //   active: isRefProgramActive,
    //   maxUsers = 0,
    //   sumPerUser = 0,
    // } = refProgram;
    const screenHeight = Dimensions.get('window').height;
    const smallScreen = screenHeight <= uiConstants.NORMAL_DEVICE_HEIGHT;
    const fontSize = smallScreen ? 18 : 22;
    const lineHeight = smallScreen ? 25 : 35;
    // const maxToRedeem = maxUsers * sumPerUser;
    // const isReferralProgramActive = !!(
    //   isRefProgramActive || featureFlags.enableReferralProgram
    // );

    return (
      <ScrollView
        style={[styles.container, smallScreen && styles.containerSmallScreen]}>
        <ReferralProgramAnnotation
          isWithExplanationLink
          onShowExplanationPress={this.toggleExplanationModal}
          // maxToRedeem={maxToRedeem}
        />

        <Text
          style={styles.header}
          size={fontSize}
          lineHeight={lineHeight}
          color={flipFlopColors.black}
          medium>
          {I18n.t('people.invite_friends.header')}
        </Text>

        <View
          style={[
            styles.invitations,
            smallScreen && styles.invitationsSmallScreen,
          ]}>
          {this.renderInvitationCards()}
        </View>
        <ShareLink
          downloadLink={downloadLinks.download}
          enrichUrl={this.enrichUrl}
        />
        {this.renderReferralStatusLink()}
        <ReferralExplanationModal
          show={isReferralExplanationModalShown}
          downloadLink={downloadLinks.download}
          enrichUrl={this.enrichUrl}
          closeModal={this.toggleExplanationModal}
          // sumPerUser={sumPerUser}
        />
      </ScrollView>
    );
  }

  renderInvitationCards = () =>
    invitations.map((invitation, index) => {
      const {method, actionSuffix, image, textSpace = 0} = invitation;
      return (
        <TouchableOpacity
          key={`invitation${method}`}
          onPress={this[actionSuffix]}
          style={[
            styles.invitation,
            commonStyles.shadow,
            index % 2 === 0 && styles.invitationWithMargin,
          ]}
          activeOpacity={1}>
          {image}
          <Text
            style={[styles.invitationText, {marginTop: textSpace}]}
            size={16}
            lineHeight={20}
            color={flipFlopColors.b30}>
            {I18n.t(`people.invite_friends.invitation_method.${method}`)}
          </Text>
        </TouchableOpacity>
      );
    });

  renderReferralStatusLink = () => (
    <TouchableOpacity
      style={styles.referralStatusLink}
      onPress={this.navigateToReferralStatus}>
      <Text size={16} lineHeight={21} color={flipFlopColors.azure}>
        {I18n.t('people.referral_status_button')}
      </Text>
      <AwesomeIcon
        name="arrow-circle-right"
        weight="solid"
        size={16}
        color={flipFlopColors.azure}
        style={styles.referralStatusIcon}
      />
    </TouchableOpacity>
  );

  getInvitationText = (method) => {
    const {
      community: {cityName},
    } = this.props;
    const downloadLink = this.enrichUrl(downloadLinks[method]);
    const invitationText = I18n.t('people.invite_friends.invitation', {
      cityName,
      downloadLink,
    });

    return encodeURIComponent(invitationText);
  };

  enrichUrl = (url) =>
    `${url}?rid=${this.props.navigation.state.params.entityId}`;

  // eslint-disable-next-line consistent-return
  sendInviteViaNativeDrawer = async () => {
    const downloadLink = this.enrichUrl(downloadLinks.messenger);
    Share.share(
      {
        ...Platform.select({
          ios: {
            message: '',
            url: downloadLink,
          },
          android: {
            message: downloadLink,
          },
        }),
        title: '',
      },
      {
        dialogTitle: `Share : `,
      },
    );
  };

  sendInviteViaWhatsapp = () => {
    const encodedInvitationText = this.getInvitationText('whatsapp');
    this.openUrl({
      url: `whatsapp://send?text=${encodedInvitationText}`,
      appName: 'Whatsapp',
      method: userInviteMethods.WHATSAPP,
    });
  };

  sendInviteViaText = () => {
    const encodedInvitationText = this.getInvitationText('sms');
    this.openUrl({
      url: `sms:${ios ? '&' : '?'}body=${encodedInvitationText}`,
      method: userInviteMethods.SMS,
    });
  };

  sendInviteViaEmail = () => {
    const encodedInvitationText = this.getInvitationText('email');
    this.openUrl({
      url: `mailto:?body=${encodedInvitationText}`,
      method: userInviteMethods.EMAIL,
    });
  };

  openUrl = ({url, appName, method}) => {
    // const {
    //   navigation: {
    //     state: {
    //       params: { entityId, inviteOrigin }
    //     }
    //   }
    // } = this.props;
    // analytics.actionEvents
    //   .invitedFriend({
    //     userId: entityId,
    //     inviteMethod: method,
    //     origin: inviteOrigin
    //   })
    //   .dispatch();
    // Linking.openURL(url).catch((err) => {
    //   Logger.error(`Linking.openUrl failed; url: ${url}, error: ${err}`);
    //   appName && Alert.alert('Missing application', `You haven't installed ${appName} yet`, [{ text: 'OK' }]);
    // });
  };

  toggleExplanationModal = () =>
    this.setState(({isReferralExplanationModalShown}) => ({
      isReferralExplanationModalShown: !isReferralExplanationModalShown,
    }));

  navigateToReferralStatus = () => {
    navigationService.navigate('ReferralProgramStatus');
  };
}

InviteFriends.propTypes = {
  navigation: PropTypes.object,
  // community: PropTypes.shape({
  //   cityName: PropTypes.string,
  // }),
  // featureFlags: PropTypes.object,
  // refProgram: PropTypes.shape({
  //   maxUsers: PropTypes.number,
  //   sumPerUser: PropTypes.number,
  //   active: PropTypes.bool,
  // }),
};

const mapStateToProps = (state) => ({
  // community: state.auth.user.community,
  // featureFlags: state.auth.featureFlags,
  // refProgram: get(state, 'auth.user.community.refProgram', {}),
});

InviteFriends = connect(mapStateToProps)(InviteFriends);
InviteFriends = Screen()(InviteFriends);
export default InviteFriends;
