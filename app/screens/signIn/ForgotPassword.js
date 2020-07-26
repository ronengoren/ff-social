import React from 'react';
import PropTypes from 'prop-types';
import {Keyboard, StyleSheet, Animated, Platform} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { apiQuery } from '/redux/apiQuery/actions';
import {Screen, FormInput} from '../../components';
import {View, Text, TextButton, Image} from '../../components/basicComponents';
import images from '../../assets/images';
import {ErrorModal} from '../../components/modals';
import {flipFlopColors, uiConstants} from '../../vars';
import {get} from '../../infra/utils';
import {screenNames} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import GoBackButton from '../../components/onboarding/GoBackButton';
import {Wrapper} from '../../components/onboarding';
import {enhanceWithLayoutAnimations} from '../signup/getLayoutAnimations';

const styles = StyleSheet.create({
  container: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 45,
    paddingHorizontal: 15,
  },
  contentWrapper: {
    flex: 1,
  },
  iosForm: {
    marginTop: 2,
    marginBottom: 100,
  },
  androidForm: {
    marginTop: 2,
    marginBottom: 80,
  },
  imageWrapper: {
    alignItems: 'flex-end',
  },
  forgotImage: {
    right: -15,
    height: 215,
    width: 245,
    marginBottom: 18,
  },
  textWrapper: {
    paddingRight: 70,
  },
  formTitle: {
    marginBottom: 14,
  },
  formInput: {
    paddingTop: 41,
    borderColor: flipFlopColors.b90,
  },
});

class ForgotPassword extends React.Component {
  state = {
    email: get(this.props, 'navigation.state.params.email', {value: ''}),
    sendingMail: false,
  };

  render() {
    const {email, sendingMail} = this.state;
    const {animationUtils} = this.props;
    const {
      messureMediaComponent,
      contentY,
      btnY,
      mediaOpacity,
      androidInputY,
    } = animationUtils;

    return (
      <Wrapper style={styles.container}>
        <GoBackButton onPress={this.onBackButtonPress} />
        <View style={styles.contentWrapper}>
          <Animated.View
            style={[
              Platform.OS === 'ios' ? styles.iosForm : styles.androidForm,
              {transform: [{translateY: contentY}]},
            ]}>
            <Animated.View
              onLayout={messureMediaComponent}
              style={[styles.imageWrapper, {opacity: mediaOpacity}]}>
              <Image
                source={images.forgotPassword.forgot}
                resizemode="contain"
                style={styles.forgotImage}
              />
            </Animated.View>
            <View style={styles.textWrapper}>
              <Text
                size={32}
                lineHeight={35}
                color={flipFlopColors.b30}
                style={styles.formTitle}
                bold>
                {I18n.t('onboarding.reset_password.page_header')}
              </Text>
              <Text size={18} lineHeight={22} color={flipFlopColors.b30}>
                {I18n.t('onboarding.reset_password.explanation')}
              </Text>
            </View>
            <Animated.View style={{transform: [{translateY: androidInputY}]}}>
              <FormInput
                style={styles.formInput}
                label={I18n.t('common.form.email')}
                keyboardType={'email-address'}
                autoCapitalize="none"
                onChange={this.onChangeHandler}
                value={email.value}
                validations={['email']}
                errorText={email.errorText}
                required
                autoCorrect={false}
                focusedBorderColor={flipFlopColors.green}
              />
            </Animated.View>
          </Animated.View>
        </View>
        <Animated.View style={{transform: [{translateY: btnY}]}}>
          <TextButton
            size="big50Height"
            busy={sendingMail}
            onPress={this.handleSubmit}
            disabled={!email.isValid}
            disabledBGColor={flipFlopColors.paleGreen}>
            {I18n.t('onboarding.reset_password.button')}
          </TextButton>
        </Animated.View>
      </Wrapper>
    );
  }

  onBackButtonPress = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  onChangeHandler = (changes) => {
    this.setState((state) => ({
      email: {
        ...state.email,
        ...changes,
      },
    }));
  };

  handleSubmit = async () => {
    //     Keyboard.dismiss();
    //     const { apiQuery } = this.props;
    //     const { email } = this.state;
    //     this.setState({ sendingMail: true });
    //     try {
    //       await apiQuery({ query: { domain: 'auth', key: 'forgotPassword', params: { email: encodeURIComponent(email.value) } } });
    //     } catch (err) {
    //       const code = get(err, 'response.data.error.code');
    //       if (code !== 6) {
    //         // no such email exists error is hidden
    //         ErrorModal.showAlert();
    //       }
    //     } finally {
    //       this.setState({
    //         sendingMail: false
    //       });
    //     }
    //     navigationService.navigate(screenNames.EmailSent, {});
  };
}

ForgotPassword.propTypes = {
  //   apiQuery: PropTypes.func,
  //   animationUtils: PropTypes.object
};

const mapDispatchToProps = {};

ForgotPassword = connect(null, mapDispatchToProps)(ForgotPassword);
ForgotPassword = Screen({modalError: true})(ForgotPassword);

export default enhanceWithLayoutAnimations()(ForgotPassword);
