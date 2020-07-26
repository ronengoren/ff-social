import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, BackHandler} from 'react-native';
import I18n from '../../../infra/localization';
import {connect} from 'react-redux';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { followPages } from '/redux/pages/actions';
import {Screen} from '../../../components';
import {View, Text, ScrollView} from '../../../components/basicComponents';
import {misc as miscLocalStorage} from '../../../infra/localStorage';
import {navigationService} from '../../../infra/navigation';
import {get} from '../../../infra/utils';
// import { Logger } from '/infra/reporting';
import {SubmitButton} from '../../../components/onboarding';
import {flipFlopColors, uiConstants} from '../../../vars';
import {screenNames} from '../../../vars/enums';
import {isRTL} from '../../../infra/utils/stringUtils';
import {isAndroid} from '../../../infra/utils/deviceUtils';
import SuggestedTopicItem from './SuggestedTopicItem';
import {Wrapper, OnBoardingProgressBar} from '../components';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 10,
  },
  title: {
    marginBottom: 5,
    marginHorizontal: 15,
  },
  rtlText: {
    textAlign: 'right',
  },
  scroll: {
    flex: 1,
    backgroundColor: flipFlopColors.transparent,
  },
  scrollContent: {
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING,
  },
  textWrapper: {
    marginBottom: 8,
  },
  listHeaderText: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  followButton: {
    marginHorizontal: 15,
  },
  bottomWrapper: {
    marginHorizontal: 15,
  },
});

class OnBoardingDiscover extends React.Component {
  state = {
    selectedTopics: {},
    selectAll: false,
    hasError: false,
  };

  render() {
    const text = I18n.t('onboarding.discover_pages.page_header');
    const isRtl = isRTL(text);

    return (
      <Wrapper style={styles.wrapper}>
        <OnBoardingProgressBar step={2} />
        <Text
          size={32}
          lineHeight={35}
          style={[styles.title, isRtl && styles.rtlText]}
          color={flipFlopColors.b30}
          bold>
          {text}
        </Text>
        {this.renderListHeader(isRtl)}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          ref={(node) => {
            this.scroll = node;
          }}>
          {this.renderTopics()}
        </ScrollView>
        <View style={styles.bottomWrapper}>
          <SubmitButton
            withTopGradient
            onPress={this.onDoneButtonPress}
            testID="discoverSubmitButton"
            isDisabled={!this.isValid()}
          />
        </View>
      </Wrapper>
    );
  }

  componentDidMount() {
    miscLocalStorage.update({
      onboardingPersistentScreen: screenNames.OnBoardingDiscover,
    });
    if (isAndroid) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  androidBackButtonListener = () => this.props.navigation.isFocused();

  renderListHeader = (isRtl) => {
    const {selectAll, hasError} = this.state;
    return (
      <View style={styles.textWrapper}>
        {hasError ? (
          <Text
            size={18}
            lineHeight={22}
            color={flipFlopColors.red}
            style={[styles.listHeaderText, isRtl && styles.rtlText]}>
            {I18n.t('onboarding.discover_pages.error_title')}
            {'\n '}
          </Text>
        ) : (
          <Text
            size={18}
            lineHeight={22}
            color={flipFlopColors.b30}
            style={[styles.listHeaderText, isRtl && styles.rtlText]}>
            {I18n.t('onboarding.discover_pages.title')}
          </Text>
        )}
        <Text
          size={16}
          lineHeight={22}
          color={
            selectAll ? flipFlopColors.secondaryBlack : flipFlopColors.green
          }
          onPress={this.toggleAllSelected}
          bold
          style={[styles.followButton, isRtl && styles.rtlText]}>
          {I18n.t(
            `onboarding.discover_pages.${
              selectAll ? 'unfollow_all_button' : 'follow_all_button'
            }`,
          )}
        </Text>
      </View>
    );
  };

  renderTopics = () => {
    // const {topics} = this.props;
    // const {selectedTopics} = this.state;
    // return topics.map((topic, index) => (
    //   <SuggestedTopicItem
    //     topic={topic}
    //     isSelected={selectedTopics[topic.id]}
    //     toggleSelection={this.toggleTopicSelection}
    //     key={topic.id}
    //     testID={`suggestedTopic-${index}`}
    //   />
    // ));
  };

  toggleTopicSelection = ({topicId}) => {
    const {selectedTopics} = this.state;
    this.setState({
      selectedTopics: {...selectedTopics, [topicId]: !selectedTopics[topicId]},
    });
  };

  toggleAllSelected = () => {
    const {topics} = this.props;
    const {selectAll} = this.state;
    const tmpSelectedTopics = {};
    topics.forEach((topic) => {
      tmpSelectedTopics[topic.id] = !selectAll;
    });
    this.setState({selectedTopics: tmpSelectedTopics, selectAll: !selectAll});
  };

  onDoneButtonPress = async () => {
    if (!this.pressedDone && this.validate()) {
      this.pressedDone = true;
      this.followTopics();
      navigationService.navigate(screenNames.OnBoardingAddFriends);
    }
  };

  isValid() {
    // const {selectedTopics} = this.state;
    // const {topics} = this.props;
    // const selectedCount = Object.keys(selectedTopics).filter(
    //   (topicId) => selectedTopics[topicId],
    // ).length;
    // const isValid = selectedCount >= Math.min(topics.length, 2);
    // return isValid;
  }

  validate = () => {
    const isValid = this.isValid();
    this.setState({hasError: !isValid}, () => {
      if (!isValid) {
        this.scroll && this.scroll.scrollTo({x: 0, y: 0, animate: true});
      }
    });
    return isValid;
  };

  followTopics = () => {
    // const { apiCommand } = this.props;
    // const { selectedTopics } = this.state;
    // const groupsIds = [];
    // try {
    //   Object.keys(selectedTopics).forEach((topicId) => {
    //     if (selectedTopics[topicId]) {
    //       groupsIds.push(topicId);
    //     }
    //   });
    //   groupsIds.length && apiCommand('groups.follow', { groupsIds: groupsIds.join(',') });
    // } catch (err) {
    //   Logger.error({ message: 'failed to follow groups in onboarding', selectedTopics, err });
    // }
  };
}

OnBoardingDiscover.propTypes = {
  // topics: PropTypes.array,
  //   apiCommand: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  // user: state.auth.user,
  // topics: get(state.auth, 'appSettings.data.topics', []),
});

const mapDispatchToProps = {
  //   apiCommand,
  //   followPages
};

OnBoardingDiscover = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnBoardingDiscover);
export default Screen({modalError: true})(OnBoardingDiscover);
