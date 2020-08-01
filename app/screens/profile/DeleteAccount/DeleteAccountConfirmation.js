import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { updateProfile } from '/redux/profile/actions';
// import { apiQuery } from '/redux/apiQuery/actions';
import {StyleSheet, ActivityIndicator} from 'react-native';
import I18n from '../../../infra/localization';
// import { showSnackbar } from '/redux/general/actions';
import {Header} from '../../../components';
import {
  View,
  ScrollView,
  NewTextButton,
  Text,
} from '../../../components/basicComponents';
import {flipFlopColors, flipFlopFontsWeights} from '../../../vars';
import {snackbarTypes} from '../../../vars/enums';
import {get, isNil} from '../../../infra/utils';
import {navigationService} from '../../../infra/navigation';
// import { analytics } from '/infra/reporting';
import ActionBox from './ActionBox';
import DeleteAccountConfirmationModal from './DeleteAccountConfirmationModal';

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
  box: {
    padding: 10,
    borderRadius: 10,
    height: 50,
  },
  deletionInfo: {
    minHeight: 50,
    marginTop: 15,
  },
  buttonsWrapper: {
    justifyContent: 'flex-end',
    padding: 10,
  },
  button: {
    flex: 0,
    maxHeight: 50,
    borderRadius: 10,
  },
  confirmButton: {
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    color: flipFlopColors.b30,
    fontWeight: flipFlopFontsWeights.bold,
  },
  buttonTextWhite: {
    color: flipFlopColors.white,
  },
  count: {
    minWidth: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 15,
  },
});

class DeleteAccountConfirmation extends React.Component {
  constructor(props) {
    super(props);
    // const {turnOffFlags, deleteAccount} = props.navigation.state.params;
    // this.isDeleteingAccount = deleteAccount;
    // this.shouldTurnOffEmails =
    //   turnOffFlags && turnOffFlags.some((flag) => flag === 'emails');
    // this.shouldTurnOffNotifications =
    //   turnOffFlags && turnOffFlags.some((flag) => flag === 'notifications');

    // if (this.isDeleteingAccount) {
    //   this.state = {
    //     isLoadingTotals: true,
    //     isConfirmationModalVisible: false,
    //     totals: {},
    //   };
    // }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <Header
            closeAction={navigationService.navigateBack}
            withShadow={false}
            withBorderBottom={false}
            hasBackButton
            searchMode={false}
            isHideSearch
          />
          <View style={styles.innerWrapper}>
            {this.renderTitle()}
            {this.renderInfo()}
            {this.isDeleteingAccount
              ? this.renderDeletePermanently()
              : this.renderturnOffFlags()}
          </View>
          {this.renderActionButtons()}
        </View>
        {this.isDeleteingAccount && this.renderDeletConfirmationModal()}
      </ScrollView>
    );
  }

  componentDidMount() {
    if (this.isDeleteingAccount) {
      this.getUserTotals();
    }
  }

  renderDeletConfirmationModal = () => {
    const {isConfirmationModalVisible} = this.state;
    return (
      <DeleteAccountConfirmationModal
        isModalVisible={isConfirmationModalVisible}
        onCancelAction={this.toggleConfirmationModal(false)}
      />
    );
  };

  renderTitle = () => (
    <View>
      <Text size={26} lineHeight={34} medium color={flipFlopColors.b30}>
        {I18n.t(
          `profile.settings.delete_account.${
            this.isDeleteingAccount ? 'delete_permanently' : 'turn_off_flags'
          }.title`,
        )}
      </Text>
    </View>
  );

  renderInfo = () => (
    <View style={styles.deletionInfo}>
      <Text size={18} lineHeight={24} color={flipFlopColors.b70}>
        {I18n.t(
          `profile.settings.delete_account.${
            this.isDeleteingAccount ? 'delete_permanently' : 'turn_off_flags'
          }.info`,
        )}
      </Text>
    </View>
  );

  renderActionButtons = () => (
    <View style={styles.buttonsWrapper}>
      <NewTextButton
        style={[styles.button, styles.confirmButton]}
        size={NewTextButton.sizes.BIG50}
        textStyle={[styles.buttonText, styles.buttonTextWhite]}
        withShadow
        customColor={
          this.isDeleteingAccount ? flipFlopColors.red : flipFlopColors.green
        }
        onPress={
          this.isDeleteingAccount
            ? this.toggleConfirmationModal(true)
            : this.turnOffFlags
        }
        activeOpacity={0.75}
        testID="deletePermanetlyAccountBtn">
        {I18n.t(
          `profile.settings.delete_account.${
            this.isDeleteingAccount ? 'delete_permanently' : 'turn_off_flags'
          }.confirm`,
        )}
      </NewTextButton>
      <NewTextButton
        style={[styles.button]}
        size={NewTextButton.sizes.BIG50}
        textStyle={[styles.buttonText]}
        customColor={flipFlopColors.paleGreyFour}
        onPress={navigationService.goBack}
        activeOpacity={0.75}>
        {I18n.t(
          `profile.settings.delete_account.${
            this.isDeleteingAccount ? 'delete_permanently' : 'turn_off_flags'
          }.cancel`,
        )}
      </NewTextButton>
    </View>
  );

  renderDeletePermanently = () => {
    const {totals = {}, isLoadingTotals} = this.state;
    const {friends, posts, groups, pages, events, saves} = totals;
    const getCounter = (count) => (
      <View style={[styles.count, {backgroundColor: flipFlopColors.red}]}>
        {isNil(count) && isLoadingTotals ? (
          <ActivityIndicator color={flipFlopColors.white} animating />
        ) : (
          <Text size={14} color={flipFlopColors.white} bold>
            {count}
          </Text>
        )}
      </View>
    );

    const RED_BOX_COLOR = '#f8485d11';
    return (
      <ScrollView>
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(friends)}
          title="Friends"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(posts)}
          title="Posts"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(groups)}
          title="Groups"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(pages)}
          title="Pages"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(events)}
          title="Events"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
        <ActionBox
          color={flipFlopColors.red}
          rightComponent={getCounter(saves)}
          title="Saves"
          titleColor={flipFlopColors.red}
          boxColor={RED_BOX_COLOR}
          containerStyle={styles.box}
        />
      </ScrollView>
    );
  };

  renderturnOffFlags = () => (
    <React.Fragment>
      {this.shouldTurnOffNotifications && (
        <ActionBox
          containerStyle={styles.box}
          title={I18n.t(
            'profile.settings.delete_account.turn_off_flags.all_notifications',
          )}
          titleColor={flipFlopColors.b30}
          icons={['bell-slash']}
        />
      )}
      {this.shouldTurnOffEmails && (
        <ActionBox
          containerStyle={styles.box}
          title={I18n.t(
            'profile.settings.delete_account.turn_off_flags.homeis_emails',
          )}
          titleColor={flipFlopColors.b30}
          icons={['envelope-open-text']}
        />
      )}
    </React.Fragment>
  );

  getFeatureFlagTurnedOff = (key) =>
    Object.keys(this.props.settings[key]).reduce(
      (reduced, key) => ({...reduced, [key]: false}),
      {},
    );

  turnOffFlags = () => {
    // const { settings: currentSettings, user, updateProfile, showSnackbar } = this.props;
    // const settings = { ...currentSettings };
    // if (this.shouldTurnOffEmails) {
    //   settings.emailNotifications = this.getFeatureFlagTurnedOff('emailNotifications');
    // }
    // if (this.shouldTurnOffNotifications) {
    //   settings.notifications = this.getFeatureFlagTurnedOff('notifications');
    // }
    // updateProfile({ userId: user.id, delta: { settings } });
    // analytics.actionEvents
    //   .changeNotificationsSettings({
    //     pushEnabled: !this.shouldTurnOffNotifications,
    //     emailEnabled: !this.shouldTurnOffEmails
    //   })
    //   .dispatch();
    // navigationService.resetToHomePage();
    // setTimeout(() => {
    //   showSnackbar({ snackbarType: snackbarTypes.SETTINGS }, { dismissAfter: 5000 });
    // }, 250);
  };

  toggleConfirmationModal = (isConfirmationModalVisible) => () => {
    this.setState({isConfirmationModalVisible});
  };

  getUserTotals = async () => {
    // const { apiQuery, user } = this.props;
    // const { id: userId } = user;
    // const res = await apiQuery({ query: { domain: 'users', key: 'getUserTotals', params: { userId } } });
    // this.setState({ isLoadingTotals: false, totals: res.data.data });
    // return res;
  };
}

DeleteAccountConfirmation.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
  settings: PropTypes.object,
  //   updateProfile: PropTypes.func,
  //   showSnackbar: PropTypes.func,
  //   apiQuery: PropTypes.func
};

const mapStateToProps = (state) => {
  // const {user} = state.auth;
  // return {
  //   settings: get(state, `auth.user.settings`),
  //   user,
  // };
};

const mapDispatchToProps = {
  //   apiQuery,
  //   updateProfile,
  //   showSnackbar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteAccountConfirmation);
