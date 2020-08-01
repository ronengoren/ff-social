import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { claimPage } from '/redux/pages/actions';
import {
  View,
  Text,
  TextArea,
  KeyboardAvoidingView,
} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.paleBlack,
  },
  modalInner: {
    borderRadius: 20,
    backgroundColor: flipFlopColors.white,
  },
  headerText: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  inputWrapper: {
    marginHorizontal: 15,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  input: {
    minHeight: 125,
    fontSize: 15,
    padding: 0,
    lineHeight: 22,
    color: flipFlopColors.black,
  },
  actionsWrapper: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    marginVertical: 20,
    textAlign: 'center',
  },
  actionsSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: flipFlopColors.b90,
  },
  claimedStateWrapper: {
    justifyContent: 'center',
  },
  doneIcon: {
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: 25,
  },
  doneHeaderText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  doneExplanation: {
    marginHorizontal: 45,
    marginBottom: 25,
    textAlign: 'center',
  },
});

class ClaimModal extends Component {
  state = {
    claimerText: '',
    isClaimed: false,
  };

  render() {
    const {isModalVisible} = this.props;
    const {isClaimed} = this.state;
    const modalContent = isClaimed
      ? this.renderClaimedState()
      : this.renderUnclaimedState();
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={() => {}}>
        <View style={styles.modal}>{modalContent}</View>
      </Modal>
    );
  }

  renderUnclaimedState = () => {
    const {claimerText} = this.state;
    return (
      <KeyboardAvoidingView style={[commonStyles.shadow, styles.modalInner]}>
        <Text
          size={18}
          lineHeight={21}
          color={flipFlopColors.realBlack}
          bold
          style={styles.headerText}>
          {I18n.t('page.claim_modal.header')}
        </Text>
        <View style={styles.inputWrapper}>
          <TextArea
            style={styles.input}
            placeholder={I18n.t('page.claim_modal.input_placeholder')}
            onChange={(val) => this.setState({claimerText: val})}
            value={claimerText}
            autoFocus
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>
        <View style={styles.actionsWrapper}>
          {this.renderButton({
            action: this.onCancelAction,
            textColor: flipFlopColors.b60,
            text: I18n.t('page.claim_modal.cancel_button'),
          })}
          <View style={styles.actionsSeparator} />
          {this.renderButton({
            action: this.onClaimAction,
            textColor: flipFlopColors.green,
            text: I18n.t('page.claim_modal.submit_button'),
          })}
        </View>
      </KeyboardAvoidingView>
    );
  };

  renderClaimedState = () => {
    const {onDoneAction} = this.props;
    return (
      <View
        style={[
          commonStyles.shadow,
          styles.modalInner,
          styles.claimedStateWrapper,
        ]}>
        <AwesomeIcon
          name="check-circle"
          size={40}
          color={flipFlopColors.green}
          style={styles.doneIcon}
        />
        <Text
          size={18}
          lineHeight={21}
          color={flipFlopColors.realBlack}
          bold
          style={styles.doneHeaderText}>
          {I18n.t('page.claim_modal.done_header')}
        </Text>
        <Text
          size={15}
          lineHeight={22}
          color={flipFlopColors.b60}
          style={styles.doneExplanation}>
          {I18n.t('page.claim_modal.done_explanation')}
        </Text>
        <View style={styles.actionsWrapper}>
          {this.renderButton({
            action: onDoneAction,
            textColor: flipFlopColors.green,
            text: I18n.t('page.claim_modal.done_button'),
          })}
        </View>
      </View>
    );
  };

  renderButton = ({action, textColor, text}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={action}
      style={styles.actionBtn}>
      <Text
        size={16}
        lineHeight={19}
        color={textColor}
        style={styles.actionBtnText}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  onCancelAction = () => {
    const {onCancelAction} = this.props;
    Keyboard.dismiss();
    onCancelAction();
  };

  onClaimAction = () => {
    // const { pageId, claimPage } = this.props;
    // const { claimerText } = this.state;
    // if (claimerText && claimerText.trim().length) {
    //   claimPage({ pageId, claimerText });
    //   Keyboard.dismiss();
    //   this.setState({ isClaimed: true });
    // }
  };
}

ClaimModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  pageId: PropTypes.string,
  //   claimPage: PropTypes.func,
  onCancelAction: PropTypes.func.isRequired,
  onDoneAction: PropTypes.func.isRequired,
};

const mapDispatchToProps = {};

ClaimModal = connect(null, mapDispatchToProps)(ClaimModal);
export default ClaimModal;
