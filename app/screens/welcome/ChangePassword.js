import React from 'react';
import PropTypes from 'prop-types';
import {Keyboard, StyleSheet, Alert} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { setToken, changedPassword } from '/redux/auth/actions';
import {ApiCommandTextButton, FormInput} from '../../components';
import {View, Text} from '../../components/basicComponents';
import {ErrorModal} from '../../components/modals';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {GoBackButton} from '../../components/onboarding';
import {flipFlopColors, uiConstants} from '../../vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT,
  },
  header: {
    width: '100%',
    height: 30,
    backgroundColor: flipFlopColors.white,
    zIndex: 10,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 30,
    textAlign: 'center',
    color: flipFlopColors.black,
  },
  form: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveBtnWrapper: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
});

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    const {
      navigation: {
        // state: {
        //   params: {token},
        // },
      },
    } = props;
    this.state = {
      oldPassword: {value: '', isValid: true},
      newPassword: {value: ''},
      confirmNewPassword: {value: ''},
    };
    // this.inAppChangePasswordMode = !token;
  }

  render() {
    const {oldPassword, newPassword, confirmNewPassword} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText} medium>
            {I18n.t('change_password.header')}
          </Text>
          <GoBackButton onPress={this.onBackButtonPress} />
        </View>

        <View style={styles.form}>
          {this.inAppChangePasswordMode && (
            <FormInput
              key="oldPasswordInput"
              label={I18n.t('change_password.old_password_label')}
              autoCapitalize={'none'}
              secureTextEntry
              onChange={this.handleChangeHandlerWrapper('oldPassword')}
              value={oldPassword.value}
              errorText={oldPassword.errorText}
              required
              returnKeyType="next"
              onSubmitEditing={() => {
                this.newPasswordInput.focus();
              }}
              autoFocus
              autoCorrect={false}
            />
          )}
          <FormInput
            label={I18n.t('change_password.new_password_label')}
            autoCapitalize={'none'}
            secureTextEntry
            onChange={this.handleChangeHandlerWrapper('newPassword')}
            value={newPassword.value}
            validations={[
              {
                type: 'minLength',
                value: 8,
                errorText: I18n.t('change_password.new_password_error'),
              },
              {validator: this.validateNewMatchPassword},
            ]}
            errorText={newPassword.errorText}
            required
            returnKeyType="next"
            ref={(node) => {
              this.newPasswordInput = node;
            }}
            onSubmitEditing={() => {
              this.confirmNewPasswordInput.focus();
            }}
            autoFocus
            autoCorrect={false}
          />
          <FormInput
            label={I18n.t('change_password.repeat_new_password_label')}
            autoCapitalize={'none'}
            secureTextEntry
            onChange={this.handleChangeHandlerWrapper('confirmNewPassword')}
            value={confirmNewPassword.value}
            validations={[{validator: this.validatePasswordRepeat}]}
            errorText={confirmNewPassword.errorText}
            required
            returnKeyType="done"
            ref={(node) => {
              this.confirmNewPasswordInput = node;
            }}
            onSubmitEditing={this.handleSubmit}
            autoCorrect={false}
          />
        </View>
        <View style={styles.saveBtnWrapper}>
          <ApiCommandTextButton
            size="big50Height"
            command="auth.changePassword"
            onPress={this.handleSubmit}
            disabled={this.isSubmitBlocked()}>
            {I18n.t('change_password.save_button')}
          </ApiCommandTextButton>
        </View>
      </View>
    );
  }

  //   componentDidMount() {
  //     const {
  //       navigation: {
  //         state: {
  //           params: { token }
  //         }
  //       },
  //       setToken
  //     } = this.props;
  //     if (token) {
  //       setToken({ token });
  //     }
  //   }

  onBackButtonPress = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  handleChangeHandlerWrapper = (field) => (changes) => {
    this.setState((state) => ({
      [field]: {
        ...state[field],
        ...changes,
      },
    }));
  };

  validateNewMatchPassword = (newPassword) => {
    const {confirmNewPassword} = this.state;
    if (confirmNewPassword.value) {
      const isValid = newPassword === confirmNewPassword.value;
      this.setState({
        confirmNewPassword: {
          value: confirmNewPassword.value,
          isValid,
          errorText: isValid
            ? ''
            : I18n.t('change_password.repeat_new_password_error'),
        },
      });
    }
    return {
      isValid: true,
    };
  };

  validatePasswordRepeat = (repeatedPassword) => {
    const {newPassword} = this.state;
    const isValid = newPassword.value === repeatedPassword;
    return {
      isValid,
      errorText: isValid
        ? ''
        : I18n.t('change_password.repeat_new_password_error'),
    };
  };

  handleSubmit = async () => {
    // const canSubmit = !this.isSubmitBlocked();
    // if (canSubmit) {
    //   Keyboard.dismiss();
    //   const { changedPassword } = this.props;
    //   const { oldPassword, newPassword } = this.state;
    //   await changedPassword({ oldPassword: oldPassword.value, newPassword: newPassword.value, onError: this.showError });
    // }
  };

  isSubmitBlocked = () =>
    Object.keys(this.state).some((key) => this.state[key].isValid === false);

  showError = (err) => {
    const code = get(err, 'response.data.error.code');
    if (!code && code !== 0) {
      ErrorModal.showAlert(I18n.t('change_password.error'));
    } else {
      Alert.alert(
        I18n.t('change_password.error_modal.header'),
        I18n.t('change_password.error_modal.body'),
        [{text: I18n.t('change_password.error_modal.button')}],
      );
    }
  };
}

ChangePassword.propTypes = {
  //   setToken: PropTypes.func,
  //   changedPassword: PropTypes.func,
  navigation: PropTypes.object,
};

const mapDispatchToProps = {
  //   setToken,
  //   changedPassword
};

export default connect(null, mapDispatchToProps)(ChangePassword);
