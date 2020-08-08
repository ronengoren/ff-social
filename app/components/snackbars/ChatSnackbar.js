import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View, Text} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {screenNames} from '../../vars/enums';
import {flipFlopColors} from '../../vars';
import {BaseHeaderSnackbar} from '../snackbars';
import {navigationService} from '../../infra/navigation';
import {userScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.green,
  },
  text: {
    textAlign: 'center',
    color: flipFlopColors.white,
    letterSpacing: 0.2,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

class ChatSnackbar extends Component {
  render() {
    return (
      <BaseHeaderSnackbar
        onPress={this.navigateToConversation}
        hideCloseButton
        style={styles.wrapper}
        {...this.props}>
        <View style={styles.headerTitle}>
          <AwesomeIcon
            style={styles.icon}
            name="comment-check"
            weight="solid"
            color={flipFlopColors.white}
            size={16}
          />
          <Text
            size={18}
            lineHeight={20}
            bold
            color={flipFlopColors.white}
            style={styles.text}>
            {I18n.t('chat.interaction_sent_snackbar.title')}
          </Text>
        </View>
        <Text
          size={15}
          lineHeight={28}
          color={flipFlopColors.white}
          style={styles.text}>
          {I18n.t('chat.interaction_sent_snackbar.subTitle')}
        </Text>
      </BaseHeaderSnackbar>
    );
  }

  navigateToConversation = () => {
    const {user, hideCurrentSnackbar} = this.props;
    const {id: participantId, name: participantName, media = {}} = user;
    const {thumbnail: participantAvatar} = media;
    const participant = {participantId, participantName, participantAvatar};
    hideCurrentSnackbar();
    navigationService.navigate(screenNames.Chat, {...participant});
  };
}

ChatSnackbar.propTypes = {
  user: userScheme,
  hideCurrentSnackbar: PropTypes.func,
};

export default ChatSnackbar;
