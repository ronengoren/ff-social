import React, {Component} from 'react';
import I18n from '/infra/localization';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions} from 'react-native';
import {View, Text, IconButton, Image} from '../../components/basicComponents';
import images from '../../assets/images';
import {flipFlopColors, uiConstants} from '../../vars';
import {navigationService} from '../../infra/navigation';

const HORIZONTAL_MARGIN = 30;
const IMAGE_LEFT_MARGIN_PERCENT = 0.03;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 60,
    paddingHorizontal: HORIZONTAL_MARGIN,
    alignItems: 'center',
  },
  image: {
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
  },
  closeButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 25,
    right: 25,
    alignItems: 'center',
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: flipFlopColors.white20,
  },
  buttonText: {
    marginTop: 7,
    marginBottom: 8 + uiConstants.FOOTER_MARGIN_BOTTOM,
    textAlign: 'center',
  },
});

class ReferralRedeemed extends Component {
  render() {
    const {navigation} = this.props;
    // const {
    //   state: {
    //     params: {redeemSum},
    //   },
    // } = navigation;

    const {width, height} = Dimensions.get('window');
    const imageWithMarginWidth = width - 2 * HORIZONTAL_MARGIN;
    const imageLeftMargin = imageWithMarginWidth * IMAGE_LEFT_MARGIN_PERCENT;
    const imageWidth = imageWithMarginWidth - imageLeftMargin;
    const imageHeight = Math.round(imageWidth * 0.488);

    return (
      <View style={styles.container}>
        <Image
          source={images.common.gradientGreen}
          style={[StyleSheet.absoluteFill, {width, height}]}
        />
        <Image
          source={images.people.referral_redeemed_people}
          style={[
            styles.image,
            {
              width: imageWidth,
              height: imageHeight,
              marginLeft: imageLeftMargin,
            },
          ]}
        />
        <Text
          bold
          size={42}
          lineHeight={52}
          color={flipFlopColors.white}
          style={styles.text}>
          {I18n.t('referral_redeemed.title')}
        </Text>
        <Text
          size={18}
          lineHeight={26}
          color={flipFlopColors.white}
          style={styles.text}>
          {I18n.t('referral_redeemed.text', {})}
        </Text>
        {this.renderCloseButton()}
      </View>
    );
  }

  renderCloseButton = () => {
    const {navigation} = this.props;
    // const {
    //   state: {
    //     params: {userEmail, prevNavigationKey},
    //   },
    // } = navigation;

    return (
      <View style={styles.closeButtonWrapper}>
        <IconButton
          name="close"
          iconColor="white"
          style={styles.closeButton}
          onPress={() => navigationService.goBack({key: prevNavigationKey})}
        />
        <Text size={13} color={flipFlopColors.white} style={styles.buttonText}>
          {I18n.t('referral_redeemed.action_summary', {email: 'userEmail'})}
        </Text>
      </View>
    );
  };
}

ReferralRedeemed.propTypes = {
  // navigation: PropTypes.object,
};

export default ReferralRedeemed;
