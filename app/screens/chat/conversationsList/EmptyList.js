import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions} from 'react-native';
import I18n from '../../../infra/localization';
import {
  View,
  Text,
  TextButton,
  Image,
} from '../../../components/basicComponents';
import images from '../../../assets/images';
import {flipFlopColors} from '../../../vars';
import {screenNames} from '../../../vars/enums';
import {navigationService} from '../../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 260,
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: flipFlopColors.white,
  },
  containerNoNotifications: {
    paddingTop: 170,
  },
  text: {
    color: flipFlopColors.buttonGrey,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 21,
  },
  subTitle: {
    marginBottom: 25,
  },
  backgroundImage: {
    position: 'absolute',
    top: 40,
    right: 0,
    height: 293,
    width: 260,
  },
  backgroundWithCta: {
    position: 'absolute',
    top: 10,
    right: 50,
    height: 294,
    width: 195,
  },
});

class EmptyList extends Component {
  state = {
    paddingBottom: 100,
  };

  render() {
    const {paddingBottom} = this.state;
    const {isNotificationsCtaVisible} = this.props;

    return (
      <View
        style={[
          styles.container,
          {paddingBottom},
          isNotificationsCtaVisible && styles.containerNoNotifications,
        ]}
        onLayout={this.handleLayout}>
        {isNotificationsCtaVisible ? (
          <Image
            source={images.chat.noMessagesWithCta}
            resizemode="cover"
            style={styles.backgroundWithCta}
          />
        ) : (
          <Image
            source={images.chat.noMessages}
            resizemode="cover"
            style={styles.backgroundImage}
          />
        )}
        <Text medium size={22} style={styles.text}>
          {I18n.t(
            'communication_center.conversations.empty_states.inbox.header',
          )}
        </Text>
        <Text size={15} style={[styles.text, styles.subTitle]}>
          {I18n.t('communication_center.conversations.empty_states.inbox.text')}
        </Text>
        {!isNotificationsCtaVisible && (
          <TextButton size="big" onPress={this.handlePress}>
            {I18n.t(
              'communication_center.conversations.empty_states.inbox.button',
            )}
          </TextButton>
        )}
      </View>
    );
  }

  calculatePadding = true;

  handlePress = () => {
    navigationService.navigate(screenNames.ChatUserSelector);
  };

  handleLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout; // eslint-disable-line no-unused-vars
    const {height: pageHeight} = Dimensions.get('window');

    if (this.calculatePadding) {
      this.calculatePadding = false;
      this.setState({paddingBottom: pageHeight - height});
    }
  };
}

EmptyList.propTypes = {
  isNotificationsCtaVisible: PropTypes.bool,
};

export default EmptyList;
