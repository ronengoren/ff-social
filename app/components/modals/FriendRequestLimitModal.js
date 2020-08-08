import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import I18n from '/infra/localization';
import {Modal, StyleSheet} from 'react-native';
import {closeFriendRequestLimitModal} from '../../redux/general/actions';
import {View, NewTextButton, Text} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.paleBlack,
  },
  modalInner: {
    borderRadius: 10,
    shadowColor: flipFlopColors.modalShadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    backgroundColor: flipFlopColors.white,
    padding: 15,
  },
  iconWrapper: {
    marginTop: 9,
    marginBottom: 21,
    alignSelf: 'center',
  },
  upperIcon: {
    position: 'absolute',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: flipFlopColors.b30,
    marginBottom: 7,
    textAlign: 'center',
  },
  text: {
    lineHeight: 22,
    textAlign: 'center',
    color: flipFlopColors.b30,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  button: {
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: flipFlopColors.white,
    fontWeight: 'bold',
  },
});

const FriendRequestLimitModal = ({show, closeFriendRequestLimitModal}) => {
  if (!show) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={show}
      onRequestClose={() => {}}>
      <View style={styles.modal}>
        <View style={styles.modalInner}>
          <View style={styles.iconWrapper}>
            <AwesomeIcon
              name="user-lock"
              size={44}
              color={flipFlopColors.veryLightBlueTwo}
              weight="solid"
            />
            <AwesomeIcon
              name="user-lock"
              size={44}
              color={flipFlopColors.b30}
              weight="light"
              style={styles.upperIcon}
            />
          </View>
          <Text style={styles.title}>
            {I18n.t('friend_request_limit.title')}
          </Text>
          <Text style={styles.text}>
            {I18n.t('friend_request_limit.description')}
          </Text>
          <NewTextButton
            size={NewTextButton.sizes.big60Wrapper}
            customColor={flipFlopColors.green}
            // onPress={closeFriendRequestLimitModal}
            width="100%"
            style={styles.button}
            textStyle={styles.buttonText}>
            {I18n.t('friend_request_limit.approve')}
          </NewTextButton>
        </View>
      </View>
    </Modal>
  );
};

FriendRequestLimitModal.propTypes = {
  show: PropTypes.bool,
  closeFriendRequestLimitModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  show: state.general.showFriendRequestLimitModal,
});

export default connect(mapStateToProps)(FriendRequestLimitModal);
