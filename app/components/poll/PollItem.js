import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity, Animated} from 'react-native';
// import { toggleListItemVote } from '/redux/lists/actions';
import {navigationService} from '../../infra/navigation';
import {get} from '../../infra/utils';
import {Text, View, Image} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {listViewTypes} from '../../vars/enums';
import {AwesomeIcon} from '../../assets/icons';
import {stylesScheme} from '../../schemas';
import {pluralTranslateWithZero} from '../../redux/utils/common';

const ITEM_DIMENSION = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    marginHorizontal: 15,
    marginBottom: 15,
    height: ITEM_DIMENSION,
  },
  lastItemContainer: {
    marginBottom: 0,
  },
  title: {
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  image: {
    height: ITEM_DIMENSION - 2,
    width: ITEM_DIMENSION - 2,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  placeholderImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.b90,
  },
  votersWrapper: {
    flexDirection: 'row',
  },
  votesWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    paddingVertical: 5,
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 10,
  },
  votedWrapper: {
    backgroundColor: flipFlopColors.azure,
    borderColor: flipFlopColors.azure,
  },
  voteIconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    top: 0,
  },
  votedIconWrapperActive: {
    top: 5,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageVotersFill: {
    position: 'absolute',
    backgroundColor: flipFlopColors.b97,
    height: '100%',
  },
});

class PollItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedPercentageValue: new Animated.Value(
        props.animateEnter ? 0 : props.votersPercentage || 0,
      ),
    };
  }

  static itemDimension = ITEM_DIMENSION;

  render() {
    const {item, onPressItem, style, isLast} = this.props;
    const {media, title, totalVotes} = item;
    const mediaUrl = get(media, '[0].thumbnail');
    const testID =
      !item.pageId && !item.googlePlaceId
        ? 'customListPollItem'
        : 'listPollItem';
    const percentageStyle = this.getPollItemStyles();

    return (
      <TouchableOpacity
        style={[styles.container, isLast && styles.lastItemContainer, style]}
        onPress={() => onPressItem({item})}
        activeOpacity={0.5}
        testID={testID}>
        {mediaUrl ? (
          <Image
            source={{uri: mediaUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImageWrapper]}>
            <AwesomeIcon
              name="image"
              size={40}
              color={flipFlopColors.white}
              weight="solid"
            />
          </View>
        )}
        <View style={styles.contentWrapper}>
          <Animated.View
            style={[styles.percentageVotersFill, percentageStyle]}
          />
          <View style={[styles.content]}>
            <Text
              style={styles.title}
              bold
              size={16}
              lineHeight={20}
              color={flipFlopColors.b30}
              numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.votersWrapper}>
              <Text
                size={14}
                lineHeight={16}
                color={flipFlopColors.b60}
                numberOfLines={1}>
                {pluralTranslateWithZero(
                  totalVotes || 0,
                  `posts.list_poll.voters`,
                )}
              </Text>
            </View>
          </View>
          {this.renderVoteButton()}
        </View>
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    const {animateEnter} = this.props;
    if (animateEnter) {
      setTimeout(this.animateChange, 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const {votersPercentage} = this.props;
    const previousVotePercentage = prevProps.votersPercentage;
    const currentVotePercentage = votersPercentage;
    if (previousVotePercentage !== currentVotePercentage) {
      this.animateChange();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animateChange);
  }

  animateChange = () => {
    const {votersPercentage} = this.props;
    const {animatedPercentageValue} = this.state;
    Animated.timing(animatedPercentageValue, {
      toValue: votersPercentage,
      duration: 500,
    }).start();
  };

  getPollItemStyles = () => {
    const {votersPercentage} = this.props;
    const {animatedPercentageValue} = this.state;
    const progressBarActualWidth = animatedPercentageValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return {
      borderTopRightRadius: votersPercentage > 97 ? 10 : 0,
      borderBottomRightRadius: votersPercentage > 97 ? 10 : 0,
      width: progressBarActualWidth,
    };
  };

  renderVoteButton = () => {
    const {item, votersPercentage} = this.props;
    const {isBusy} = this.state;
    const {voted} = item;

    return (
      <TouchableOpacity
        onPress={this.toggleListItemVote}
        activeOpacity={0.75}
        disabled={isBusy}>
        <View
          style={[
            commonStyles.smallShadow,
            styles.votesWrapper,
            voted && styles.votedWrapper,
          ]}>
          <View
            style={[
              styles.voteIconWrapper,
              voted && styles.votedIconWrapperActive,
            ]}>
            <AwesomeIcon
              name={voted ? 'check' : 'caret-up'}
              size={voted ? 14 : 22}
              color={voted ? flipFlopColors.white : flipFlopColors.azure}
              weight="solid"
            />
          </View>
          <Text
            color={voted ? flipFlopColors.white : flipFlopColors.b30}
            size={16}>
            {votersPercentage.toFixed(0)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  toggleListItemVote = async () => {
    // const { listId, toggleListItemVote, item, user } = this.props;
    // const { id, voted } = item;
    // const screenName = navigationService.getCurrentRouteName();
    // this.setState({ isBusy: true });
    // await toggleListItemVote({ listId, listItemId: id, voteAction: !voted, voter: user, screenName, listViewType: listViewTypes.POLL, sortByVotes: false });
    // this.setState({ isBusy: false });
  };
}

PollItem.propTypes = {
  listId: PropTypes.string,
  user: PropTypes.object,
  animateEnter: PropTypes.bool,
  isLast: PropTypes.bool,
  votersPercentage: PropTypes.number,
  //   toggleListItemVote: PropTypes.func,
  onPressItem: PropTypes.func,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    totalVotes: PropTypes.number.isRequired,
    media: PropTypes.array,
    pageId: PropTypes.string,
    googlePlaceId: PropTypes.string,
    voted: PropTypes.bool,
    id: PropTypes.string,
  }),
  style: stylesScheme,
};

const mapStateToProps = (state) => ({
  user: get(state, 'auth.user'),
});

const mapDispatchToProps = {
  //   toggleListItemVote
};

PollItem = connect(mapStateToProps, mapDispatchToProps)(PollItem);
export default PollItem;
