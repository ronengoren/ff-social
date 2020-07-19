import React from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {
  View,
  TextInput,
  QueryCancelIcon,
  Text,
} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {isRTL} from '../../infra/utils/stringUtils';
import {flipFlopColors, commonStyles} from '../../vars';

const BORDER_RADIUS = 10;
const SEARCH_BOX_HEIGHT = 39;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    height: SEARCH_BOX_HEIGHT,
    borderRadius: BORDER_RADIUS,
  },
  appContainer: {
    ...commonStyles.tinyShadow,
    shadowOpacity: 0,
    shadowColor: flipFlopColors.green,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  inputWrapper: {
    flex: 1,
    width: '100%',
    height: SEARCH_BOX_HEIGHT,
  },
  obInputWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b80,
  },
  appFocused: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
  },
  input: {
    width: '100%',
    height: '100%',
    padding: 0,
    paddingRight: 20,
    fontSize: 16,
    lineHeight: 18,
    color: flipFlopColors.b30,
    borderRadius: BORDER_RADIUS,
    textAlign: 'left',
  },
  appInput: {
    paddingLeft: 11,
  },
  obCancelIcon: {
    top: 9,
    right: 5,
  },
  cancelIcon: {
    top: 9,
    right: 10,
  },
  closeButton: {
    marginLeft: 10,
    marginRight: 5,
    alignSelf: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 11,
    width: 30,
    height: SEARCH_BOX_HEIGHT,
    lineHeight: SEARCH_BOX_HEIGHT,
    marginTop: -1,
  },
  searchIconRTL: {
    position: 'absolute',
    right: -4,
    width: 30,
    height: SEARCH_BOX_HEIGHT,
    lineHeight: SEARCH_BOX_HEIGHT,
    marginTop: -1,
  },
  inputPlaceholder: {
    position: 'absolute',
    height: SEARCH_BOX_HEIGHT,
    bottom: 2,
    left: 33,
    right: 15,
    lineHeight: SEARCH_BOX_HEIGHT,
  },
  inputPlaceholderRTL: {
    left: 15,
    right: 33,
    textAlign: 'right',
    lineHeight: SEARCH_BOX_HEIGHT,
  },
});

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

class HeaderSearchInput extends React.Component {
  state = {
    isFocused: false,
    focusStateAnimate: new Animated.Value(0),
  };

  render() {
    const {
      searchMode,
      searchPlaceholder = I18n.t('header.search'),
      closeButtonPlaceholder = I18n.t('onboarding.search_country.close_button'),
      onPress,
      onCancel,
      value,
      onPressClose,
      isOnboarding,
      ...restProps
    } = this.props;
    const {isFocused, focusStateAnimate} = this.state;
    const shadowOpacity = focusStateAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    });

    const placeHolderText = I18n.t('home.search_placeholder');
    const isRTLText = isRTL(placeHolderText);

    const containerStyles = isOnboarding
      ? []
      : [styles.appContainer, isFocused && styles.appFocused, {shadowOpacity}];
    return (
      <View style={[commonStyles.flex1, commonStyles.flexDirectionRow]}>
        <AnimatedTouchableOpacity
          style={[styles.container, containerStyles]}
          activeOpacity={1}
          onPress={onPress}>
          <View
            pointerEvents={searchMode ? 'auto' : 'none'}
            style={styles.inputWrapper}>
            <TextInput
              ref={(node) => {
                this.textInput = node;
              }}
              containerStyle={[
                styles.inputWrapper,
                isOnboarding && styles.obInputWrapper,
              ]}
              inputStyle={[styles.input, !isOnboarding && styles.appInput]}
              autoCapitalize={'none'}
              value={value}
              placeholder={searchMode ? searchPlaceholder : ''}
              placeholderTextColor={flipFlopColors.b70}
              autoFocus={searchMode}
              autoCorrect={false}
              onFocus={() => !isFocused && this.setFocusState(true)}
              onBlur={() => isFocused && this.setFocusState(false)}
              forceLTR
              testID="headerSearchInput"
              selectionColor={flipFlopColors.green}
              {...restProps}
            />
            {searchMode && !!value && (
              <QueryCancelIcon
                size={isOnboarding ? 20 : 18}
                iconColor={
                  isOnboarding ? flipFlopColors.green : flipFlopColors.b60
                }
                iconName={isOnboarding ? 'times' : 'times-circle'}
                onPress={onCancel}
                style={isOnboarding ? styles.obCancelIcon : styles.cancelIcon}
              />
            )}
            {!searchMode && [
              <AwesomeIcon
                name="search"
                size={16}
                color={flipFlopColors.b70}
                weight="solid"
                style={isRTLText ? styles.searchIconRTL : styles.searchIcon}
                key="icon"
              />,
              <Text
                size={16}
                color={flipFlopColors.b70}
                style={[
                  styles.inputPlaceholder,
                  isRTLText && styles.inputPlaceholderRTL,
                ]}
                numberOfLines={1}
                key="placeholder">
                {placeHolderText}
              </Text>,
            ]}
          </View>
        </AnimatedTouchableOpacity>
        {onPressClose && (
          <Text
            size={16}
            lineHeight={30}
            color={flipFlopColors.green}
            onPress={onPressClose}
            style={styles.closeButton}>
            {closeButtonPlaceholder}
          </Text>
        )}
      </View>
    );
  }
  setFocusState = (nextFocusState) => {
    const {focusStateAnimate} = this.state;
    Animated.timing(focusStateAnimate, {
      toValue: nextFocusState ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    this.setState({isFocused: nextFocusState});
  };
  focus() {
    this.textInput && this.textInput.focus();
  }
}

HeaderSearchInput.propTypes = {
  closeButtonPlaceholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  isOnboarding: PropTypes.bool,
  searchMode: PropTypes.bool,
  value: PropTypes.string,
  onPress: PropTypes.func,
  onPressClose: PropTypes.func,
  onCancel: PropTypes.func,
};

export default HeaderSearchInput;
