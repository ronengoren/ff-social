import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, StyleSheet} from 'react-native';
import I18n from '../../../infra/localization';
import {connect} from 'react-redux';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { logout } from '/redux/auth/actions';
import {View, Text, NewTextButton} from '../../../components/basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
// import { analytics } from '/infra/reporting';
import {flipFlopColors, commonStyles} from '../../../vars';

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.paleBlack,
  },
  modalInner: {
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    margin: 10,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
  },
  headerText: {
    marginTop: 2,
    marginHorizontal: 10,
  },
  details: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionsWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    marginHorizontal: 15,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
  },
});

class DeleteAccountConfirmationModal extends Component {
  render() {
    const {isModalVisible} = this.props;

    return (
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => {}}>
        <View style={styles.modal} testID="deleteAccountConfirmationModal">
          <View style={[styles.modalInner, commonStyles.shadow]}>
            <View style={styles.title}>
              <AwesomeIcon
                name="exclamation-circle"
                weight="solid"
                size={18}
                color={flipFlopColors.red}
              />
              <Text
                style={styles.headerText}
                size={18}
                color={flipFlopColors.b30}
                bold>
                {I18n.t(
                  'profile.settings.delete_account.delete_permanently.confirmation_modal.title',
                )}
              </Text>
            </View>
            <View style={styles.details}>
              <Text color={flipFlopColors.b30} size={16} lineHeight={22}>
                {I18n.t(
                  'profile.settings.delete_account.delete_permanently.confirmation_modal.info',
                )}
              </Text>
            </View>
            <View style={styles.actionsWrapper}>
              {this.renderButton({
                buttonColor: flipFlopColors.paleGreyFour,
                action: this.onCancelAction,
                textColor: flipFlopColors.b30,
                text: I18n.t(
                  'profile.settings.delete_account.delete_permanently.confirmation_modal.cancel',
                ),
              })}
              {this.renderButton({
                buttonColor: flipFlopColors.red,
                withShadow: true,
                action: this.deleteAccount,
                textColor: flipFlopColors.white,
                text: I18n.t(
                  'profile.settings.delete_account.delete_permanently.confirmation_modal.confirm',
                ),
                testID: 'deleteAccountConfirmationBtn',
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderButton = ({
    action,
    textColor,
    text,
    buttonColor,
    withShadow,
    testID,
  }) => (
    <NewTextButton
      style={[styles.actionBtn]}
      size={NewTextButton.sizes.BIG50}
      withShadow={withShadow}
      customColor={buttonColor}
      onPress={action}
      activeOpacity={0.75}
      testID={testID}>
      <Text size={16} color={textColor} bold>
        {text}
      </Text>
    </NewTextButton>
  );

  deleteAccount = async () => {
    // const { apiCommand, user, logout } = this.props;
    // const { id: userId } = user;
    // await apiCommand('users.delete', { userId });
    // analytics.actionEvents.deleteAccount().dispatch();
    // await logout({});
  };

  onCancelAction = () => {
    const {onCancelAction} = this.props;
    onCancelAction();
  };
}

DeleteAccountConfirmationModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  onCancelAction: PropTypes.func.isRequired,
  //   apiCommand: PropTypes.func,
  user: PropTypes.object,
  //   logout: PropTypes.func
};

const mapDispatchToProps = {
  //   apiCommand,
  //   logout
};

const mapStateToProps = (state) => {
  const {user} = state.auth;
  return {
    user,
  };
};

DeleteAccountConfirmationModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteAccountConfirmationModal);
export default DeleteAccountConfirmationModal;
