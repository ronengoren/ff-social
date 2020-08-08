import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {TextInput, View, Text, TranslatedText} from '../basicComponents';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';
import {stylesScheme} from '../../schemas';

const LEFT_PADDING = 16;
const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  labelNormal: {
    marginBottom: 5,
  },
  input: {
    borderBottomColor: flipFlopColors.b90,
    borderBottomWidth: 1,
    width: '100%',
    marginTop: 5,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: flipFlopColors.b80,
  },
  inputIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  inputWrapperWithAbsoluteButton: {
    height: 55,
  },
  absoluteIconWrapper: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    left: LEFT_PADDING,
  },
  hintIcon: {
    marginLeft: 'auto',
    marginRight: 5,
  },
  hintText: {
    width: '100%',
    position: 'absolute',
    padding: 8,
    paddingLeft: 10,
    backgroundColor: flipFlopColors.b30,
    borderRadius: 5,
    bottom: 85,
    // remove this will make the layers behind the hint to be visible
    elevation: 1,
    zIndex: 1,
  },
  triangle: {
    width: 14,
    height: 7,
    position: 'absolute',
    bottom: -9,
    right: 5,
    borderLeftWidth: 10,
    borderLeftColor: flipFlopColors.transparent,
    borderRightWidth: 10,
    borderRightColor: flipFlopColors.transparent,
    borderTopWidth: 10,
    borderTopColor: flipFlopColors.b30,
  },
  disabled: {
    opacity: 0.5,
  },
});

class OnboardingInputField extends Component {
  // eslint-disable-next-line react/sort-comp
  static labelSizes = {
    SMALL: 'small',
    NORMAL: 'normal',
  };

  constructor(props) {
    super(props);
    const {value, validate, hintVisible} = props;
    this.state = {
      value,
      isValid: validate && !!value ? validate(value) : !!value,
      hintVisible,
      hintOpacity: props.hintVisible
        ? new Animated.Value(1)
        : new Animated.Value(0),
    };
  }

  render() {
    const {value, hintVisible} = this.state;
    const {
      containerStyle,
      isDummy,
      label,
      labelSize,
      onPress,
      showError,
      hintText,
      isDisabled,
    } = this.props;
    const icon = this.getIconProps();

    const labelTextDefinitions = {
      small: {
        size: 14,
        lineHeight: 20,
        color:
          !value && showError ? flipFlopColors.red : flipFlopColors.realBlack30,
      },
      normal: {
        size: 22,
        lineHeight: 22,
        color: !value && showError ? flipFlopColors.red : flipFlopColors.b30,
        style: styles.labelNormal,
      },
    };
    return (
      <View style={(styles.container, containerStyle)}>
        <View style={[commonStyles.flexDirectionRow]}>
          {label && (
            <TranslatedText {...labelTextDefinitions[labelSize]} forceLtr>
              {label}
            </TranslatedText>
          )}
          {hintText && (
            <AwesomeIcon
              onPress={this.toggleHint}
              key="icon"
              name="info-circle"
              weight={hintVisible ? 'solid' : 'light'}
              color={flipFlopColors.b30}
              size={18}
              style={styles.hintIcon}
            />
          )}
        </View>

        {isDummy ? (
          <TouchableOpacity
            style={[styles.input]}
            activeOpacity={isDisabled ? 1 : 0.5}
            onPress={isDisabled ? null : onPress}>
            {icon}
            {hintVisible && this.renderHint()}
            {this.renderInput()}
          </TouchableOpacity>
        ) : (
          <View style={[styles.inputWrapperWithAbsoluteButton]}>
            {hintVisible && this.renderHint()}
            {this.renderInput()}
            <View style={[styles.absoluteIconWrapper]}>{icon}</View>
          </View>
        )}
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    const {value, isDummy} = this.props;
    if (prevProps.value !== value && isDummy) {
      this.onChangeInput(value);
    }
  }

  getIconProps = () => {
    const {
      renderIconHandled,
      placeholderIconName,
      renderIcon,
      showError,
    } = this.props;
    const {value, isValid} = this.state;
    const iconColor =
      !value && showError ? flipFlopColors.red : flipFlopColors.green;

    if ((value || renderIconHandled) && renderIcon) {
      return renderIcon({value, isValid});
    }
    if (value && isValid) {
      return (
        <AwesomeIcon
          name="check"
          size={20}
          color={flipFlopColors.green}
          weight="solid"
          style={styles.inputIcon}
          key="icon"
        />
      );
    }
    if (placeholderIconName === 'search') {
      return (
        <HomeisIcon
          key="icon"
          name="search"
          color={iconColor}
          size={22}
          style={styles.inputIcon}
        />
      );
    } else if (placeholderIconName === 'envelope') {
      return (
        <HomeisIcon
          key="icon"
          name={placeholderIconName}
          color={iconColor}
          size={22}
          style={styles.inputIcon}
        />
      );
    } else if (placeholderIconName === 'calendar') {
      return (
        <AwesomeIcon
          key="icon"
          name={placeholderIconName}
          color={iconColor}
          size={18}
          style={(styles.inputIcon, {marginLeft: 1, marginRight: 12})}
        />
      );
    }
    return null;
  };

  renderInput() {
    const {
      isDummy,
      label,
      placeholderText,
      inputProps,
      testID,
      showError,
      isDisabled,
    } = this.props;
    const {value} = this.state;

    return isDummy ? (
      <Text
        size={16}
        lineHeight={16}
        color={!value && showError ? flipFlopColors.red : flipFlopColors.b60}
        testID={testID}
        style={isDisabled && styles.disabled}>
        {value || placeholderText}
      </Text>
    ) : (
      <TextInput
        placeholder={value ? label : placeholderText}
        placeholderTextColor={
          !value && showError ? flipFlopColors.red : flipFlopColors.b60
        }
        inputStyle={[styles.input, isDisabled && styles.disabled]}
        value={value}
        onChange={this.onChangeInput}
        autoCorrect={false}
        testID={testID}
        {...inputProps}
      />
    );
  }

  renderHint = () => {
    const {hintText} = this.props;
    const {hintOpacity, hintVisible} = this.state;
    return (
      <Animated.View
        style={[styles.hintText, {opacity: hintOpacity}]}
        onStartShouldSetResponder={() => hintVisible}>
        <View style={styles.triangle} />
        <View style={styles.triangle2} />
        <Text size={15} lineHeight={19} color={flipFlopColors.white}>
          {hintText}
        </Text>
      </Animated.View>
    );
  };

  onChangeInput = (value) => {
    const {onChange, validate} = this.props;
    const isValid = validate && !!value ? validate(value) : !!value;
    this.setState({value, isValid});
    if (onChange) {
      onChange({value, isValid});
    }
  };

  animateOpacity = (toValue) =>
    Animated.spring(this.state.hintOpacity, {
      toValue,
      duration: 2500,
      useNativeDriver: true,
    }).start();

  hideHint = () => {
    const {hintVisible} = this.state;
    if (hintVisible) {
      this.animateOpacity(0);
      this.setState({hintVisible: false});
    }
  };

  showHint = () => {
    const {hintVisible} = this.state;

    if (!hintVisible) {
      this.animateOpacity(1);
      this.setState({hintVisible: true});
    }
  };

  toggleHint = () => {
    const {onPressHintIcon} = this.props;
    const {hintVisible} = this.state;
    onPressHintIcon && onPressHintIcon({hintVisible});
    if (!hintVisible) {
      this.showHint();
    } else {
      this.hideHint();
    }
  };
}

OnboardingInputField.defaultProps = {
  hintVisible: false,
  labelSize: OnboardingInputField.labelSizes.NORMAL,
};

OnboardingInputField.propTypes = {
  isDisabled: PropTypes.bool,
  renderIconHandled: PropTypes.bool,
  labelSize: PropTypes.string,
  hintVisible: PropTypes.bool,
  isDummy: PropTypes.bool,
  inputProps: PropTypes.object,
  onPressHintIcon: PropTypes.func,
  validate: PropTypes.func,
  renderIcon: PropTypes.func,
  label: PropTypes.string,
  placeholderText: PropTypes.string,
  placeholderIconName: PropTypes.string,
  onPress: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  hintText: PropTypes.node,
  testID: PropTypes.string,
  showError: PropTypes.bool,
  containerStyle: stylesScheme,
};

export default OnboardingInputField;
