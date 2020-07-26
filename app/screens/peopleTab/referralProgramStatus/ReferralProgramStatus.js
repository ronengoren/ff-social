import React, {Component} from 'react';
import I18n from '../../..//infra/localization';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import {apiQuery} from '/redux/apiQuery/actions';
// import {redeemReferral} from '/redux/users/actions';
import {StyleSheet} from 'react-native';
import {
  ScrollView,
  View,
  Text,
  Spinner,
  NewTextButton,
  TextInLine,
} from '../../../components/basicComponents';
import {GenericConfirmationModal, ErrorModal} from '../../../components/modals';
import {GenericEmptyState} from '../../../components/emptyState/';
import {get} from '../../../infra/utils';
// import Logger from '/infra/reporting/Logger';
import {navigationService} from '../../../infra/navigation';
import {commonStyles, flipFlopColors} from '../../../vars';
import {referrerStatus, screenNames} from '../../../vars/enums';
import ReferredUser from './ReferredUser';

const EMAIL_NOT_VERIFIED_ERROR_CODE = 18;

const styles = StyleSheet.create({
  redeemButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: flipFlopColors.white,
    padding: 15,
  },
  redeemButton: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderWidth: 0,
  },
  redeemButtonText: {
    color: flipFlopColors.b70,
    fontSize: 16,
    lineHeight: 21,
  },
  activeRedeemButton: {
    backgroundColor: flipFlopColors.green,
  },
  activeRedeemButtonText: {
    color: flipFlopColors.white,
  },
  redeemError: {
    textAlign: 'center',
    paddingTop: 5,
  },
  referrersLists: {
    marginBottom: 105,
  },
  redeemedTitle: {
    margin: 15,
  },
  emptyStateWrap: {
    paddingTop: 30,
  },
  verifyEmailModalText: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    textAlign: 'center',
  },
});

class ReferralProgramStatus extends Component {
  state = {
    showVerifyEmailModal: false,
  };

  render() {
    const {referrers, isLoading} = this.props;

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <View style={commonStyles.flex1}>
        {referrers && referrers.length
          ? this.renderReferrers()
          : this.renderEmptyState()}
        {!!(referrers && referrers.length) && this.renderRedeemButton()}
        {this.renderVerifyEmailModal()}
      </View>
    );
  }

  //   componentDidMount() {
  //     this.props.apiQuery({ reducerStatePath: 'users.referrers', query: { domain: 'users', key: 'getReferrers', params: {} } });
  //   }

  renderRedeemButton() {
    const redeemSum = this.getRedeemSum();
    const {isRedeemable, errorMessage} = this.getRedeemStatus();

    return (
      <View style={styles.redeemButtonWrapper}>
        <NewTextButton
          size={NewTextButton.sizes.BIG50}
          style={[
            styles.redeemButton,
            isRedeemable && styles.activeRedeemButton,
          ]}
          textStyle={[
            styles.redeemButtonText,
            isRedeemable && styles.activeRedeemButtonText,
          ]}
          onPress={this.redeem}
          disabled={!isRedeemable}>
          {I18n.t('referral_program_status.redeem_button', {sum: redeemSum})}
        </NewTextButton>
        {!!errorMessage.length && (
          <Text
            size={13}
            lineHeight={18}
            color={flipFlopColors.b70}
            style={styles.redeemError}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }
  renderReferrers() {
    const eligibleReferrers = this.getReferrersByStatuses([
      referrerStatus.ELIGIBLE,
    ]);
    const redeemedReferrers = this.getReferrersByStatuses([
      referrerStatus.REDEEM_IN_PROGRESS,
      referrerStatus.REDEEMED,
    ]);
    return (
      <ScrollView style={styles.referrersLists}>
        {!!eligibleReferrers.length &&
          eligibleReferrers.map((user, index) => (
            <ReferredUser
              key={user.id}
              user={user}
              hasBottomBorder={index !== eligibleReferrers.length - 1}
            />
          ))}
        {!!redeemedReferrers.length && (
          <TextInLine style={styles.redeemedTitle}>
            {I18n.t('referral_program_status.redeemed_users_title')}
          </TextInLine>
        )}
        {!!redeemedReferrers.length &&
          redeemedReferrers.map((user, index) => (
            <ReferredUser
              key={user.id}
              user={user}
              hasBottomBorder={index !== redeemedReferrers.length - 1}
            />
          ))}
      </ScrollView>
    );
  }

  renderEmptyState = () => (
    <View style={styles.emptyStateWrap}>
      <GenericEmptyState
        iconName="child"
        isHomeisIcon={false}
        headerText={I18n.t('referral_program_status.empty_state.title')}
        bodyText={I18n.t('referral_program_status.empty_state.body')}
      />
    </View>
  );

  renderVerifyEmailModal() {
    const {showVerifyEmailModal} = this.state;
    const headerText = I18n.t(
      'referral_program_status.unverified_mail_modal.title',
    );
    const confirmText = I18n.t(
      'referral_program_status.unverified_mail_modal.confirm_button',
    );
    const cancelText = I18n.t(
      'referral_program_status.unverified_mail_modal.cancel_button',
    );

    return (
      <GenericConfirmationModal
        show={showVerifyEmailModal}
        headerText={headerText}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={this.navigateToSettings}
        onCancel={this.toggleVerifyEmailModal}>
        <Text
          size={16}
          lineHeight={22}
          color={flipFlopColors.b30}
          style={styles.verifyEmailModalText}>
          {I18n.t('referral_program_status.unverified_mail_modal.text')}
        </Text>
      </GenericConfirmationModal>
    );
  }

  getReferrersByStatuses = (statuses) => {
    const {referrers} = this.props;
    return referrers
      ? referrers.filter((r) => statuses.includes(r.contextData.refStatus))
      : [];
  };

  getRedeemSum() {
    const {refProgram} = this.props;
    const eligibleReferrers = this.getReferrersByStatuses([
      referrerStatus.ELIGIBLE,
    ]);
    const redeemedReferrers = this.getReferrersByStatuses([
      referrerStatus.REDEEMED,
    ]);
    if (eligibleReferrers.length === 0 || !refProgram.active) {
      return 0;
    } else {
      const remainingRedeems = refProgram.maxUsers - redeemedReferrers.length;
      const referrersToRedeem = Math.min(
        eligibleReferrers.length,
        remainingRedeems,
      );
      return referrersToRedeem * refProgram.sumPerUser;
    }
  }

  getRedeemStatus() {
    const {referrers} = this.props;
    let errorMessage = '';

    if (!referrers) {
      return {isRedeemable: false, errorMessage};
    }

    const isRedeemProcessing = referrers.some(
      (r) => r.contextData.refStatus === referrerStatus.REDEEM_IN_PROGRESS,
    );
    const eligibleReferrersCount = this.getReferrersByStatuses([
      referrerStatus.ELIGIBLE,
    ]).length;
    const isMinimumReferrals = eligibleReferrersCount >= 5;
    if (isRedeemProcessing && eligibleReferrersCount > 0) {
      errorMessage = I18n.t(
        'referral_program_status.redeem_button_disabled_messages.processing',
      );
    } else if (eligibleReferrersCount > 0 && eligibleReferrersCount < 5) {
      errorMessage = I18n.t(
        'referral_program_status.redeem_button_disabled_messages.min_users',
      );
    }

    return {
      isRedeemable: !isRedeemProcessing && isMinimumReferrals,
      errorMessage,
    };
  }

  redeem = async () => {
    // const {redeemReferral, userEmail, navigation} = this.props;
    // const userIdsToRedeem = this.getReferrersByStatuses([
    //   referrerStatus.ELIGIBLE,
    // ]).map((r) => r.id);
    // const redeemSum = this.getRedeemSum();
    // try {
    //   await redeemReferral({requesterEmail: userEmail, userIdsToRedeem});
    //   navigationService.navigate(screenNames.ReferralRedeemed, {
    //     redeemSum,
    //     userEmail,
    //     prevNavigationKey: navigation.state.key,
    //   });
    // } catch (err) {
    //   const errCode = get(err, 'response.data.error.code');
    //   if (errCode === EMAIL_NOT_VERIFIED_ERROR_CODE) {
    //     this.setState({showVerifyEmailModal: true});
    //   } else {
    //     Logger.error({errType: 'redeemReferrals', errCode, err});
    //     ErrorModal.showAlert();
    //   }
    // }
  };

  toggleVerifyEmailModal = () => {
    this.setState(({showVerifyEmailModal}) => ({
      showVerifyEmailModal: !showVerifyEmailModal,
    }));
  };

  navigateToSettings = () => {
    navigationService.navigate(screenNames.Settings);
    this.toggleVerifyEmailModal();
  };
}

ReferralProgramStatus.propTypes = {
  isLoading: PropTypes.bool,
  referrers: PropTypes.array,
  refProgram: PropTypes.shape({
    active: PropTypes.bool,
    maxUsers: PropTypes.number,
    sumPerUser: PropTypes.number,
  }),
  userEmail: PropTypes.string,
  //   apiQuery: PropTypes.func,
  //   redeemReferral: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => {
  const {loading, data} = get(state, 'users.referrers', {});

  return {
    isLoading: loading,
    referrers: data,
    refProgram: get(state, 'auth.user.community.refProgram', {}),
    // userEmail: state.auth.user.email,
  };
};
export default connect(mapStateToProps, {})(ReferralProgramStatus);
