import React, {useState} from 'react';
import {Animated, Dimensions, StyleSheet, Easing} from 'react-native';
import {get} from '../../infra/utils';
import {flipFlopColors, uiConstants} from '../../vars';

const {height} = Dimensions.get('window');
const MODAL_Y_POSITION = height + 100;

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

const animationDefaults = {
  easing: Easing.linear,
  duration: 350,
};

const useSlideUpModal = (Component) =>
  React.memo((props) => {
    const [modal, toggleModal] = useState({});
    const [translateY] = useState(new Animated.Value(MODAL_Y_POSITION));

    const hideModal = () => {
      Animated.timing(translateY, {
        toValue: MODAL_Y_POSITION,
        ...animationDefaults,
        useNativeDriver: true,
      }).start(() => {
        toggleModal({content: null, type: null, options: {}});
      });
      return true;
    };

    let onClickOutside;
    const showModal = ({content, type, options}) => {
      if (options && options.keepModalOnClickOutside) {
        onClickOutside = () => false;
      } else {
        onClickOutside = () => hideModal();
      }
      toggleModal({content, type, options});
      Animated.timing(translateY, {
        toValue: 1,
        ...animationDefaults,
        useNativeDriver: true,
      }).start();
    };

    const visibleModal = get(modal, 'type', '');
    return (
      <React.Fragment>
        <Component
          showModal={showModal}
          hideModal={hideModal}
          visibleModal={visibleModal}
          {...props}
        />
        {modal && modal.content && (
          <Animated.View
            onPress={onClickOutside}
            style={[styles.modal]}
            onStartShouldSetResponder={onClickOutside}>
            <Animated.View
              onStartShouldSetResponder={() => false}
              style={[styles.modalContent, {transform: [{translateY}]}]}>
              {modal.content}
            </Animated.View>
          </Animated.View>
        )}
      </React.Fragment>
    );
  });

export default useSlideUpModal;
