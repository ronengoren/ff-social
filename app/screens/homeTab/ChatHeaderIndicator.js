import React from 'react';
import {useSelector} from 'react-redux';
import {flipFlopColors} from '../../vars';
import {screenNames} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import HeaderIndicator from './HeaderIndicator';

function ChatHeaderIndicator() {
  const unreadChats = useSelector((state) => get(state, 'inbox.unreadChats'));
  const navigateToChatLobby = () => {
    navigationService.navigate(screenNames.ChatLobby);
  };

  return (
    <HeaderIndicator
      count={unreadChats}
      action={navigateToChatLobby}
      iconName="comment"
      badgeColor={flipFlopColors.pinkishRed}
      testID="chatTabBtn"
    />
  );
}

export default ChatHeaderIndicator;
