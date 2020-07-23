import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {get} from '../../infra/utils';
import I18n from '../../infra/localization';
import {navigationService} from '../../infra/navigation';
// import chatService from '/infra/chat/chatService';
import {View, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {
  entityTypes,
  chatInteractioDefinitions,
  interactionTypes,
  screenNames,
  originTypes,
} from '../../vars/enums';
// import { Logger, analytics } from '/infra/reporting';
import {userScheme} from '../../schemas';
import InteractionIcon from './InteractionIcon';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  separator: {
    backgroundColor: flipFlopColors.b90,
    width: 1,
  },
});

class InteractionsBar extends Component {
  render() {
    const {style} = this.props;
    return (
      <View style={[styles.container, style]}>
        {Object.keys(chatInteractioDefinitions).map(this.renderItem)}
      </View>
    );
  }

  renderItem = (interactionKey, index) => {
    const {
      name,
      iconName,
      iconColor,
      isBoardsInteraction,
    } = chatInteractioDefinitions[interactionKey];
    const {
      isFlatIcons,
      interactionIconsContainerStyle,
      buttonSize,
      iconSize,
      separatorHeight,
      ownUser,
      withSeparators,
    } = this.props;
    const isLast = index === Object.keys(chatInteractioDefinitions).length - 1;
    if (isBoardsInteraction) {
      return null;
    }
    return (
      <React.Fragment key={name}>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            this.handleItemPressed({
              interaction: {type: name, senderId: ownUser.id},
            })
          }
          testID={`${name}InteractionBtn`}>
          <View style={interactionIconsContainerStyle}>
            <InteractionIcon
              iconName={iconName}
              iconColor={iconColor}
              iconSize={iconSize}
              buttonSize={buttonSize}
              withShadow={!isFlatIcons}
              withBorder={!isFlatIcons}
            />
          </View>
          <Text
            size={13}
            lineHeight={15}
            color={flipFlopColors.b30}
            style={styles.text}>
            {I18n.t(`chat.interactions.types.${name}`)}
          </Text>
        </TouchableOpacity>
        {withSeparators && !isLast && (
          <View
            key={`sep-${name}`}
            style={[styles.separator, {height: separatorHeight}]}
          />
        )}
      </React.Fragment>
    );
  };

  navigateToInteraction = ({channel, interaction, user}) => {
    navigationService.navigate(screenNames.ChatInteraction, {
      channel,
      user,
      interaction,
    });
  };

  trackAnalytics = ({interactionType}) => {
    // const { user: recipient, ownUser, originType } = this.props;
    // analytics.actionEvents
    //   .clickToMessageAction({
    //     actorId: ownUser.id,
    //     actorName: ownUser.name,
    //     entityType: entityTypes.USER,
    //     screenCollection: originType,
    //     interactionType,
    //     recipientId: recipient.id,
    //     recipientName: recipient.name,
    //     recipientType: entityTypes.USER
    //   })
    //   .dispatch();
  };

  navigateToConversation = ({interaction, user}) => {
    const participant = {
      participantId: user.id,
      participantName: user.name,
      participantAvatar: user.media.thumbnail,
    };

    navigationService.navigate(screenNames.Chat, {...participant, interaction});
  };

  async getChannelAndParticipant() {
    // const { user, ownUser } = this.props;
    // const channel = await chatService.getChannelOrCreate({ participantId: user.id });
    // if (channel) {
    //   return channel;
    // } else {
    //   Logger.error({ errType: 'chat', err: { message: `Failed to fetch chat channel, participantId - ${user.id}, ownUserId - ${ownUser.id}` } });
    //   return null;
    // }
  }

  handleItemPressed = async ({interaction}) => {
    const {user} = this.props;
    const channel = await this.getChannelAndParticipant();
    const channelInteractionType = get(channel, 'data.interaction.type');
    const isInteractionTypeNotChanged =
      channelInteractionType === interaction.type;
    const isMessageSelected = interaction.type === interactionTypes.GENERAL;

    this.trackAnalytics({interactionType: interaction.type});

    if (isInteractionTypeNotChanged || isMessageSelected) {
      this.navigateToConversation({interaction, user});
    } else {
      this.navigateToInteraction({interaction, user, channel});
    }
  };
}

InteractionsBar.defaultProps = {
  buttonSize: 25,
  iconSize: 20,
  separatorHeight: 20,
  isFlatIcons: false,
  withSeparators: false,
};

InteractionsBar.propTypes = {
  user: PropTypes.object,
  ownUser: userScheme,
  withSeparators: PropTypes.bool,
  isFlatIcons: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  interactionIconsContainerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  buttonSize: PropTypes.number,
  iconSize: PropTypes.number,
  separatorHeight: PropTypes.number,
  originType: PropTypes.oneOf(Object.values(originTypes)),
};

const mapStateToProps = (state) => ({
  ownUser: get(state, 'auth.user', {}),
});

InteractionsBar = connect(mapStateToProps)(InteractionsBar);
export default InteractionsBar;
