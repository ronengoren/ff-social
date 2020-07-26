import React, {useState, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AwesomeIcon} from '../../assets/icons';
import I18n from '../../infra/localization';
import {flipFlopColors} from '../../vars';
import {View} from '../basicComponents';
import FormInput from './FormInput';

const styles = StyleSheet.create({
  showPasswordIcon: {
    position: 'absolute',
    right: 0,
    top: 34,
  },
  iconMargin: {
    marginRight: 1,
  },
});

const PasswordInput = forwardRef(({value, errorText, ...restProps}, ref) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <View>
      <FormInput
        label={I18n.t('common.form.password')}
        autoCapitalize={'none'}
        secureTextEntry={!isPasswordShown}
        value={value}
        validations={[
          {
            type: 'minLength',
            value: 6,
            errorText: I18n.t('common.form.password_min_chars', {minChars: 6}),
          },
        ]}
        errorText={errorText}
        required
        returnKeyType={'next'}
        ref={ref}
        autoCorrect={false}
        focusedBorderColor={flipFlopColors.green}
        errorColor={flipFlopColors.cerise}
        {...restProps}
      />
      <TouchableOpacity
        style={[styles.showPasswordIcon, isPasswordShown && styles.iconMargin]}
        onPress={() => setIsPasswordShown(!isPasswordShown)}>
        <AwesomeIcon
          name={!isPasswordShown ? 'eye-slash' : 'eye'}
          size={17}
          color={flipFlopColors.green}
          weight="solid"
        />
      </TouchableOpacity>
    </View>
  );
});

PasswordInput.propTypes = {
  value: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
};

export default PasswordInput;
