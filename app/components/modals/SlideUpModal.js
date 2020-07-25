import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Dimensions, Modal} from 'react-native';
import {flipFlopColors, uiConstants} from '../../vars';

const {height: INITIAL_Y_POSITION} = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: flipFlopColors.realBlack40,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 20,
  },
  modalContent: {
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
  },
});

function SlideUpModal({Content, closeModal}) {
  const [translateY] = useState(new Animated.Value(INITIAL_Y_POSITION));
  useEffect(() => {
    animateIn();
  }, []);

  function animateIn() {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Modal
      animationType="fade"
      visible
      transparent
      onRequestClose={closeModal}
      onClickOutside={closeModal}>
      <Animated.View
        onPress={closeModal}
        style={[styles.modal]}
        onStartShouldSetResponder={closeModal}>
        <Animated.View
          onStartShouldSetResponder={() => false}
          style={[styles.modalContent, {transform: [{translateY}]}]}>
          {Content}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

SlideUpModal.propTypes = {
  Content: PropTypes.node.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default SlideUpModal;
