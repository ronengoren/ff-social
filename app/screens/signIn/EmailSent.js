import React from 'react';
import {StyleSheet, Keyboard, Dimensions} from 'react-native';
import {Screen} from '../../components';
import videos from '../../assets/videos';
import I18n from '../../infra/localization';
import {
  View,
  TextButton,
  Text,
  ScrollView,
} from '../../components/basicComponents';
import {flipFlopColors, uiConstants} from '../../vars';
import {screenNames} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {Wrapper, GoBackButton, HeaderMedia} from '../../components/onboarding';

const VIDEO_RATIO = 1.7742857143;

const styles = StyleSheet.create({
  container: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 20,
  },
  backButtonIcon: {
    left: 20,
    top: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 27,
  },
  media: {
    marginTop: -40,
  },
  lowerSection: {
    paddingTop: 59,
    paddingHorizontal: 15,
  },
  title: {
    marginBottom: 15,
  },
  text: {
    width: '75%',
  },
  goBackBtnWrapper: {
    paddingHorizontal: 15,
  },
});

class EmailSent extends React.Component {
  render() {
    const {width} = Dimensions.get('window');
    return (
      <Wrapper style={styles.container}>
        <GoBackButton
          onPress={this.onBackButtonPress}
          style={styles.backButtonIcon}
        />
        <View style={{width, height: width / VIDEO_RATIO}}>
          <HeaderMedia
            videoSource={videos.forgotPassword}
            wrapperStyle={styles.media}
          />
        </View>
        <ScrollView style={styles.lowerSection}>
          <Text
            size={32}
            lineHeight={35}
            color={flipFlopColors.b30}
            style={styles.title}
            bold>
            {I18n.t('onboarding.password_reset_modal.title')}
          </Text>
          <Text
            size={18}
            lineHeight={22}
            color={flipFlopColors.b30}
            style={styles.text}>
            {I18n.t('onboarding.reset_password.explanation')}
          </Text>
        </ScrollView>
        <View style={styles.goBackBtnWrapper}>
          <TextButton size="big50Height" onPress={this.backToSignIn}>
            {I18n.t('onboarding.password_reset_modal.dismiss_button')}
          </TextButton>
        </View>
      </Wrapper>
    );
  }

  onBackButtonPress = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  backToSignIn() {
    navigationService.navigate(screenNames.SignIn, {});
  }
}

EmailSent.propTypes = {};

export default Screen({modalError: true})(EmailSent);
