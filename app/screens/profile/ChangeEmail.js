import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { updateProfile } from '/redux/profile/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
import {StyleSheet, Keyboard, Platform} from 'react-native';
import I18n from '../../infra/localization';
import {Header, FormInput} from '../../components';
import {
  View,
  IconButton,
  KeyboardAvoidingView,
  NewTextButton,
} from '../../components/basicComponents';
import {ErrorModal} from '../../components/modals';
import {flipFlopColors, uiConstants} from '../../vars';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  innerWrapper: {
    flex: 1,
    padding: 20,
  },
  saveButtonWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButton: {
    borderRadius: 0,
  },
  saveButtonText: {
    color: flipFlopColors.white,
  },
});

class ChangeEmail extends React.Component {
  // state = {
  //   email: {value: this.props.user.email || ''},
  // };

  render() {
    // const {email} = this.state;

    return (
      <View style={styles.wrapper}>
        <Header
          leftComponent={this.renderBackButton()}
          isHideSearch
          backgroundColor={flipFlopColors.paleGreyTwo}
        />
        <View style={styles.innerWrapper}>
          <View>
            <FormInput
              value={'email.value'}
              // isValid={email.isValid}
              // errorText={email.errorText}
              // onChange={this.onEmailChange}
              validations={['email']}
              label={I18n.t('common.form.email')}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              ref={(node) => {
                this.emailInput = node;
              }}
              keyboardType={'email-address'}
            />
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'position', android: null})}
          style={styles.saveButtonWrapper}>
          <NewTextButton
            size={NewTextButton.sizes.BIG60}
            customColor={flipFlopColors.azure}
            onPress={this.updatePageData}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}>
            {I18n.t('page.create.part2.save_button')}
          </NewTextButton>
        </KeyboardAvoidingView>
      </View>
    );
  }

  renderBackButton = () => (
    <IconButton
      name="back-arrow"
      iconColor="b30"
      iconSize={26}
      onPress={this.navigateBack}
      hitSlop={uiConstants.BTN_HITSLOP}
    />
  );

  navigateBack = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  onEmailChange = (changes) => {
    // this.setState((state) => ({
    //   email: {
    //     ...state.email,
    //     ...changes,
    //   },
    // }));
  };

  updatePageData = async () => {
    // const { email } = this.state;
    // const { user, updateProfile, apiCommand } = this.props;
    // if (this.emailInput && this.emailInput.validate) {
    //   const { isValid } = this.emailInput.validate(email.value);
    //   if (!isValid) {
    //     this.emailInput.handleInputBlur();
    //     return;
    //   }
    // }
    // try {
    //   await apiCommand('users.changeEmail', { email: email.value });
    //   updateProfile({ userId: user.id, delta: { user: { ...user, email: email.value } } });
    //   navigationService.goBack();
    // } catch (err) {
    //   const { code, message } = get(err, 'response.data.error');
    //   if (!code && code !== 0) {
    //     ErrorModal.showAlert('Email change failed');
    //   } else {
    //     ErrorModal.showAlert('Email change failed', message);
    //   }
    // }
  };
}

ChangeEmail.propTypes = {
  // user: PropTypes.shape({
  //   email: PropTypes.string,
  //   id: PropTypes.string,
  // }),
  //   apiCommand: PropTypes.func,
  //   updateProfile: PropTypes.func
};

const mapStateToProps = (state) => {
  //   const userId = state.auth.user.id;
  //   const { user } = state.profile[userId].data;
  //   return {
  //     user
  //   };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
