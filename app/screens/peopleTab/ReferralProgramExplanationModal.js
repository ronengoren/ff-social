import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet, Modal} from 'react-native';
import {View, Text, IconButton} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import ShareLink from './ShareLink';

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.paleBlack,
  },
  container: {
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    padding: 20,
  },
  closeModalBtn: {
    position: 'absolute',
    top: 4,
    right: 19,
    width: 30,
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    marginBottom: 25,
  },
});

class ReferralExplanationModal extends Component {
  render() {
    const {show, closeModal, downloadLink, enrichUrl, sumPerUser} = this.props;
    return (
      <Modal animationType="fade" transparent visible={show}>
        <View style={styles.background}>
          <View style={styles.container}>
            <Text
              bold
              size={20}
              color={flipFlopColors.realBlack}
              style={styles.title}>
              {I18n.t('people.referral_explanation.title')}
            </Text>
            <Text
              size={16}
              lineHeight={22}
              color={flipFlopColors.b30}
              alignLocale
              style={styles.description}>
              {I18n.t('people.referral_explanation.description', {
                sumPerUser,
                maxRedeem: sumPerUser * 5,
              })}
            </Text>
            <ShareLink
              downloadLink={downloadLink}
              enrichUrl={enrichUrl}
              isDarkButton
            />
            <IconButton
              name="close"
              style={styles.closeModalBtn}
              iconColor="b70"
              iconSize={15}
              onPress={closeModal}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

ReferralExplanationModal.propTypes = {
  show: PropTypes.bool,
  downloadLink: PropTypes.string.isRequired,
  enrichUrl: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  sumPerUser: PropTypes.number,
};

export default ReferralExplanationModal;
