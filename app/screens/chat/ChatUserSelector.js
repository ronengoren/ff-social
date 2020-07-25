import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
// import { search as querySearch, initSearchInStack, removeSearchFromStack, clearSearch } from '/redux/search/actions';
import {
  Screen,
  SearchResultsList,
  UsersList,
  EmptySearch,
} from '../../components';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  IconButton,
  QueryCancelIcon,
  Avatar,
} from '../../components/basicComponents';
import {navigationService} from '../../infra/navigation';
import {uiConstants, flipFlopColors, commonStyles} from '../../vars';
import {searchTypes, entityTypes, screenNames} from '../../vars/enums';
import {get} from '../../infra/utils';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: uiConstants.NAVBAR_HEIGHT,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    backgroundColor: flipFlopColors.white,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 15,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
    width: '100%',
    marginLeft: 45,
    marginRight: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  inputContainer: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.transparent,
  },
  inputContainerFocused: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
  },
  input: {
    fontSize: 16,
    color: flipFlopColors.b30,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 25,
  },
  cancelIcon: {
    position: 'absolute',
    top: 15,
    right: 10,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 61,
    padding: 15,
    borderBottomColor: flipFlopColors.disabledGrey,
    borderBottomWidth: 1,
    backgroundColor: flipFlopColors.white,
  },
  searchResultRowImage: {
    marginRight: 10,
  },
  searchResultRowTextWrapper: {
    flex: 1,
  },
  searchResultRowText: {
    textAlign: 'left',
  },
});

class ChatUserSelector extends React.Component {
  state = {
    searchTerm: '',
    isFocused: false,
  };

  render() {
    const {selectFriends} = this.props;
    const {searchTerm, isFocused} = this.state;
    return (
      <View style={styles.wrapper}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <View style={[styles.header, commonStyles.tinyShadow]}>
          <IconButton
            name="back-arrow"
            style={styles.backButton}
            iconColor="b30"
            iconSize={26}
            onPress={this.navigateBack}
            hitSlop={uiConstants.BTN_HITSLOP}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              onChange={(val) => this.setState({searchTerm: val})}
              onChangeDebounced={this.handleQueryChange}
              debounceTime={100}
              containerStyle={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
              ]}
              autoCapitalize="none"
              value={searchTerm}
              placeholder={
                selectFriends
                  ? I18n.t('select_users.search_input_placeholder')
                  : I18n.t(
                      'communication_center.conversations.input_placeholder',
                    )
              }
              placeholderTextColor={flipFlopColors.b60}
              inputStyle={styles.input}
              height={45}
              autoFocus
              onFocus={() => !isFocused && this.setState({isFocused: true})}
              onBlur={() => isFocused && this.setState({isFocused: false})}>
              {!!searchTerm && (
                <QueryCancelIcon
                  onPress={this.clearSearch}
                  iconColor={flipFlopColors.b70}
                  style={styles.cancelIcon}
                />
              )}
            </TextInput>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={commonStyles.flex1}>
          {selectFriends
            ? this.renderFriendsSearch()
            : this.renderSearchResults()}
        </KeyboardAvoidingView>
      </View>
    );
  }

  //   componentDidMount() {
  //     const { selectFriends, initSearchInStack } = this.props;
  //     !selectFriends && initSearchInStack({ searchTypes: [searchTypes.CHAT] });
  //   }

  //   componentWillUnmount() {
  //     const { selectFriends, removeSearchFromStack } = this.props;
  //     !selectFriends && removeSearchFromStack({ searchTypes: [searchTypes.CHAT] });
  //   }

  renderFriendsSearch = () => {
    const {searchTerm} = this.state;
    return (
      <UsersList
        reducerStatePath={'friendships.friends'}
        apiQuery={{
          domain: 'friendships',
          key: 'friends',
          params: {perPage: 15, searchTerm},
        }}
        onUserPressed={this.startConversation}
        renderRightComponent={() => {}}
        ListEmptyComponent={
          <EmptySearch text={I18n.t('select_users.empty_state')} />
        }
      />
    );
  };

  renderSearchResults = () => {
    const {
      search,
      querySearch,
      communityId,
      destinationTagName,
      nationalityGroupId,
    } = this.props;
    if (!search || !search.results) {
      return null;
    }
    const {results, query, resultsNumberPages, isSearching} = search;
    return (
      <SearchResultsList
        results={results}
        resultsNumberPages={resultsNumberPages}
        query={query}
        querySearch={(query, page) =>
          querySearch({
            query,
            page,
            communityId,
            destinationTagName,
            singleEntityType: entityTypes.USER,
            searchType: searchTypes.CHAT,
            nationalityGroupId,
          })
        }
        onSearchResultPress={this.startConversation}
        isSearching={isSearching}
        customResultComponent={this.renderSearchResultRow()}
      />
    );
  };

  renderSearchResultRow = () => ({searchResult, onPress}) => {
    const {id, name, themeColor, thumbnail} = searchResult;
    return (
      <TouchableOpacity
        onPress={() => onPress(searchResult)}
        activeOpacity={0.5}
        style={styles.searchResultRow}>
        <Avatar
          entityId={id}
          entityType={entityTypes.USER}
          themeColor={themeColor}
          thumbnail={thumbnail}
          name={name}
          style={styles.searchResultRowImage}
          size="small"
          linkable={false}
        />
        <View style={styles.searchResultRowTextWrapper}>
          <Text
            size={16}
            color={flipFlopColors.realBlack}
            style={styles.searchResultRowText}
            bold
            numberOfLines={1}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  handleQueryChange = (query) => {
    const {
      selectFriends,
      searchQuery,
      querySearch,
      clearSearch,
      communityId,
      destinationTagName,
      nationalityGroupId,
    } = this.props;
    this.setState({searchTerm: query});
    if (!selectFriends) {
      if (query && query.length) {
        const trimmedText = query.trim();
        if (trimmedText !== searchQuery) {
          querySearch({
            query: trimmedText,
            page: 0,
            communityId,
            destinationTagName,
            singleEntityType: entityTypes.USER,
            searchType: searchTypes.CHAT,
            nationalityGroupId,
          });
        }
      } else {
        clearSearch({searchTypes: [searchTypes.CHAT]});
      }
    }
  };

  clearSearch = () => {
    this.setState({searchTerm: ''});
  };

  navigateBack = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  startConversation = (user) => {
    const participant = {
      participantId: user.objectID || user.id,
      participantName: user.name,
      participantAvatar: get(user, 'media.thumbnail'),
    };
    navigationService.navigate(screenNames.Chat, participant);
  };
}

ChatUserSelector.propTypes = {
  selectFriends: PropTypes.bool,
  search: PropTypes.shape({
    page: PropTypes.number,
    query: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object),
    resultsNumberPages: PropTypes.number,
    isSearching: PropTypes.bool,
  }),
  searchQuery: PropTypes.string,
  communityId: PropTypes.string,
  nationalityGroupId: PropTypes.string,
  destinationTagName: PropTypes.string,
  //   querySearch: PropTypes.func,
  //   clearSearch: PropTypes.func,
  //   initSearchInStack: PropTypes.func,
  //   removeSearchFromStack: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  search: get(state, `search.searchStack.${searchTypes.CHAT}`),
  searchTerms: state.search.searchTerms,
  searchQuery: get(state, `search.searchStack.${searchTypes.CHAT}.query`, ''),
  communityId: get(state, 'auth.user.community.id', ''),
  nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
  destinationTagName: get(state, 'auth.user.community.destinationTagName'),
  userId: state.auth.user.id,
  selectFriends: get(ownProps.navigation, 'state.params.selectFriends', false),
});

const mapDispatchToProps = {
  //   querySearch,
  //   clearSearch,
  //   initSearchInStack,
  //   removeSearchFromStack
};

ChatUserSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatUserSelector);
ChatUserSelector = Screen()(ChatUserSelector);

export default ChatUserSelector;
