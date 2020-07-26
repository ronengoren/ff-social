import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextInput, Animated, Platform, StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View} from '../basicComponents';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import * as validators from '../../infra/utils/formValidations';
import {stylesScheme} from '../../schemas';

const LABEL_BOTTOM_TOP = 32;
const LABEL_BOTTOM_CENTER = 8;
const LABEL_FONT_SIZE_TOP = 12;
const LABEL_FONT_SIZE_CENTER = 16;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
    paddingTop: 25,
    paddingBottom: 1,
    marginBottom: 10,
    flexGrow: 1,
  },
  containerFocused: {
    borderBottomWidth: 2,
    paddingBottom: 0,
  },
  containerWithError: {
    borderColor: flipFlopColors.red,
    borderBottomWidth: 2,
    paddingBottom: 0,
  },
  label: {
    color: flipFlopColors.b60,
    position: 'absolute',
    left: Platform.select({ios: 0, android: 4}),
    paddingBottom: 1,
    fontFamily: flipFlopFonts.regular,
    fontWeight: flipFlopFontsWeights.regular,
  },
  labelFocused: {
    paddingBottom: 0,
  },
  labelWithError: {
    paddingBottom: 0,
    color: flipFlopColors.red,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
  },
  labelInputWithText: {
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
  },
  input: {
    height: Platform.select({ios: 35, android: 41}),
    fontSize: 16,
    color: flipFlopColors.b30,
  },
});

class FormInput extends Component {
  constructor(props) {
    super(props);

    if (!props.validations || !props.validations.length) {
      this.validations = [() => ({isValid: true, errorText: ''})];
    } else {
      this.validations = props.validations.map((validation) => {
        if (typeof validation === 'string') {
          return validators[validation]();
        }
        const {validator, type, value, errorText} = validation;
        if (validator) {
          return validator;
        }
        return validators[type](value, errorText);
      });
    }
    const {value, isInitiallyFocused} = props;
    const initialValue = value || '';
    this.state = {
      isFocused: isInitiallyFocused,
      labelBottom: new Animated.Value(
        initialValue ? LABEL_BOTTOM_TOP : LABEL_BOTTOM_CENTER,
      ),
      labelFontSize: new Animated.Value(
        initialValue ? LABEL_FONT_SIZE_TOP : LABEL_FONT_SIZE_CENTER,
      ),
    };
  }

  render() {
    const {
      label,
      style,
      value,
      errorText,
      onChange,
      isValid,
      inputStyle,
      onFocus,
      focusedBorderColor,
      errorColor,
      ...restProps
    } = this.props;
    const {isFocused, labelBottom, labelFontSize} = this.state;
    const inputValue = value || '';
    const inputErrorText = errorText || '';
    const labelText = inputErrorText || label;

    return (
      <View
        style={[
          styles.container,
          style,
          isFocused && styles.containerFocused,
          isFocused && {borderColor: focusedBorderColor},
          !!inputErrorText && styles.containerWithError,
          !!inputErrorText && errorColor && {borderColor: errorColor},
        ]}>
        <Animated.Text
          style={[
            styles.label,
            isFocused && styles.labelFocused,
            !!inputErrorText && styles.labelWithError,
            !!inputErrorText && errorColor && {color: errorColor},
            !!inputValue && styles.labelInputWithText,
            {bottom: labelBottom, fontSize: labelFontSize},
          ]}>
          {labelText}
        </Animated.Text>
        <TextInput
          style={[styles.input, inputStyle]}
          selectionColor={flipFlopColors.green}
          // onChangeText={this.handleInputChanged}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          value={inputValue}
          spellCheck
          ref={(node) => {
            this.textInput = node;
          }}
          underlineColorAndroid={flipFlopColors.transparent}
          {...restProps}
        />
      </View>
    );
  }

  componentDidMount() {
    // const {value, required, onChange, isInitiallyFocused} = this.props;
    // const initialValue = value || '';
    // let isValid = true;
    // if (!required && !initialValue.length) {
    //   isValid = true;
    // } else {
    //   const validationRes = this.validate(initialValue);
    //   isValid = !!initialValue.length && validationRes.isValid;
    // }
    // if (isInitiallyFocused) {
    //   this.textInput.focus();
    // }
    // onChange({isValid});
  }

  componentDidUpdate(prevProps) {
    const {showLabelOnTop} = this.props;
    if (prevProps.showLabelOnTop !== showLabelOnTop) {
      Animated.parallel([
        this.animateLabel(
          'labelBottom',
          showLabelOnTop ? LABEL_BOTTOM_TOP : LABEL_BOTTOM_CENTER,
        ),
        this.animateLabel(
          'labelFontSize',
          showLabelOnTop ? LABEL_FONT_SIZE_TOP : LABEL_FONT_SIZE_CENTER,
        ),
      ]);
    }
  }

  handleInputChanged = (newValue) => {
    // const {value, onChange} = this.props;
    // const inputValue = value || '';
    // if (!inputValue.length && newValue.length) {
    //   Animated.parallel([
    //     this.animateLabel('labelBottom', LABEL_BOTTOM_TOP),
    //     this.animateLabel('labelFontSize', LABEL_FONT_SIZE_TOP),
    //   ]);
    // } else if (inputValue.length && !newValue.length) {
    //   Animated.parallel([
    //     this.animateLabel('labelBottom', LABEL_BOTTOM_CENTER),
    //     this.animateLabel('labelFontSize', LABEL_FONT_SIZE_CENTER),
    //   ]);
    // }
    // const {isValid} = this.validate(newValue);
    // onChange({isValid, value: newValue, errorText: ''});
  };

  handleInputBlur = () => {
    // const {value, onChange} = this.props;
    // const inputValue = value || '';
    // const {isValid, errorText} = this.validate(inputValue);
    // this.setState({isFocused: false});
    // onChange({isValid, errorText});
  };

  validate = (newValue) => {
    if (!newValue || !newValue.trim().length) {
      return {
        isValid: !this.props.required,
        errorText: this.props.required
          ? I18n.t('common.form.required_field')
          : '',
      };
    }

    let isValid;
    let errorText;

    // eslint-disable-next-line no-restricted-syntax
    for (const validation of this.validations) {
      const result = validation(newValue);
      ({isValid, errorText} = result);
      if (!isValid || result.break) break;
    }
    return {isValid, errorText};
  };

  animateLabel = (key, to) => {
    Animated.timing(this.state[key], {
      toValue: to,
      duration: 300,
    }).start();
  };

  focus = () => {
    this.textInput.focus();
  };

  handleInputFocus = () => {
    const {onFocus} = this.props;
    this.setState({isFocused: true});
    onFocus && onFocus();
  };
}

FormInput.defaultProps = {
  focusedBorderColor: flipFlopColors.green,
};

FormInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  errorColor: PropTypes.string,
  isInitiallyFocused: PropTypes.bool,
  showLabelOnTop: PropTypes.bool,
  isValid: PropTypes.bool,
  // onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  errorText: PropTypes.string,
  required: PropTypes.bool,
  validations: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  ),
  style: stylesScheme,
  inputStyle: stylesScheme,
  focusedBorderColor: PropTypes.string,
};

export default FormInput;
