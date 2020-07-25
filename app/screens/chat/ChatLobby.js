import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import {Screen, SubHeader} from '../../components';
import {get} from '../../infra/utils';
import I18n from '../../infra/localization';
import {commonStyles} from '../../vars';
import {chatTabTypes} from '../../vars/enums';
import {
  ConversationsList,
  ConversationsListHeader,
  Tabs,
} from './conversationsList';
// import useUnreadPagesCount from './useUnreadPagesCount';

const headerTabs = {
  PRIVATE: 'private',
  PAGES: 'pages',
};

function ChatLobby({navigation}) {
  const tabs = [
    {
      value: headerTabs.PRIVATE,
      name: I18n.t(
        `communication_center.conversations.headers.${headerTabs.PRIVATE}`,
      ),
    },
    {
      value: headerTabs.PAGES,
      name: I18n.t(
        `communication_center.conversations.headers.${headerTabs.PAGES}`,
      ),
    },
  ];
  const [headerTab, setHeaderTab] = useState(
    get(navigation, 'state.params.initialTab', tabs[0].value),
  );
  const [activeTab, setActiveTab] = useState(chatTabTypes.INBOX);
  const [isUnreadSort, setIsUnreadSort] = useState(false);
  // tabs[1].counter = useUnreadPagesCount();
  const pagesCount = useSelector((state) =>
    get(state, 'auth.user.totals.ownedPages', 0),
  );
  const isHeaderTabPages = headerTab === headerTabs.PAGES;

  return (
    <View style={commonStyles.flex1}>
      <ConversationsListHeader disableComposeBtn={isHeaderTabPages} />
      {!!pagesCount && (
        <SubHeader
          activeTab={headerTab}
          onTabChange={setHeaderTab}
          tabs={tabs}
          fullWidth
        />
      )}
      {isHeaderTabPages ? (
        <ConversationsList
          activeTab={chatTabTypes.PAGES}
          isUnreadSort
          pagesCount={pagesCount}
        />
      ) : (
        <>
          <Tabs
            activeTab={activeTab}
            onPress={setActiveTab}
            isUnreadSort={isUnreadSort}
            onSortChange={() => setIsUnreadSort(!isUnreadSort)}
          />
          <ConversationsList
            activeTab={activeTab}
            isUnreadSort={isUnreadSort}
          />
        </>
      )}
    </View>
  );
}

ChatLobby.propTypes = {
  navigation: PropTypes.object,
};

const ChatLobbyScreen = Screen()(ChatLobby);
export default ChatLobbyScreen;
