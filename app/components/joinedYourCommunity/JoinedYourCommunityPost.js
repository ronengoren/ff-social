import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {
  View,
  Text,
  Image,
  Avatar,
  TruncatedMultiLineName,
} from '../basicComponents';
import {PostFooter} from '../../components';
import {EntityAction} from '../../components/entity';
import {PostActionSheetButton} from '../../components/posts';
import {flipFlopColors, commonStyles} from '../../vars';
import {postTypes, entityTypes, screenNames} from '../../vars/enums';
import {AwesomeIcon} from '../../assets/icons';
import images from '../../assets/images';
import {navigationService} from '../../infra/navigation';
import {isAppAdmin} from '../../infra/utils';

const MAX_CAROUSEL_USER_ITEMS = 10;
const VIEW_ALL_JOINERS = 'viewAllJoiners';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  postPageWrapper: {
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  header: {
    paddingHorizontal: 30,
    marginTop: 30,
  },
  title: {
    marginBottom: 8,
  },
  firstCarouselUserItem: {
    marginLeft: 10,
  },
  carouselItem: {
    width: 90,
    height: 110,
    marginRight: 10,
    borderRadius: 15,
    marginVertical: 25,
  },
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 15,
  },
  innerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  userNameWrapper: {
    marginTop: 60,
  },
  viewAllJoinersItem: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.b90,
    borderWidth: 1,
  },
  viewAllJoinersIcon: {
    marginTop: 15,
  },
  viewAllJoinersInnerWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: -5,
    left: 5,
  },
});

class JoinedYourCommunityPost extends React.Component {
  constructor(props) {
    super(props);
    const {data, totalCount} = props.data.newUsers;
    if (totalCount > MAX_CAROUSEL_USER_ITEMS) {
      this.listData = [
        ...data.slice(0, MAX_CAROUSEL_USER_ITEMS - 1),
        {name: VIEW_ALL_JOINERS},
      ];
    } else {
      this.listData = [...data.slice(0, MAX_CAROUSEL_USER_ITEMS)];
    }
  }

  render() {
    const {
      isPostPage,
      data,
      data: {actor},
    } = this.props;

    return (
      <View
        style={[
          styles.wrapper,
          isPostPage && styles.postPageWrapper,
          commonStyles.shadow,
        ]}>
        <Image
          source={images.communityJoined.post}
          resizeMode="stretch"
          style={styles.backgroundImage}
        />
        {this.renderHeader()}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.listData}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.name}
        />
        <EntityAction
          data={data}
          actor={actor}
          context={data}
          contextPost={data}
          contentType={postTypes.PASSIVE_POST}
          entityType={entityTypes.POST}
          size={EntityAction.sizes.BIG}
        />
        <PostFooter post={data} isPostPage={isPostPage} />
      </View>
    );
  }

  renderHeader = () => {
    const {data} = this.props;
    const {title, text} = data.payload;
    return (
      <View style={styles.header}>
        <PostActionSheetButton post={data} style={styles.menuButton} />
        <Text
          size={24}
          lineHeight={24}
          color={flipFlopColors.b30}
          bold
          style={[styles.title, commonStyles.textAlignCenter]}>
          {title}
        </Text>
        <Text
          size={18}
          lineHeight={24}
          color={flipFlopColors.b30}
          style={commonStyles.textAlignCenter}>
          {text}
        </Text>
      </View>
    );
  };

  renderItem = ({item, index}) => {
    if (item.name === VIEW_ALL_JOINERS) {
      return this.renderViewAllJoinersItem();
    }
    return this.renderCarouselUserItem({item, index});
  };

  renderCarouselUserItem = ({item, index}) => {
    const {
      id,
      name,
      themeColor,
      media: {thumbnail},
    } = item;
    const firstItem = index === 0;
    return (
      <TouchableOpacity
        onPress={() =>
          navigationService.navigateToProfile({
            entityId: id,
            data: {name, thumbnail, themeColor},
          })
        }
        activeOpacity={1}
        style={[
          commonStyles.tinyShadow,
          styles.carouselItem,
          firstItem && styles.firstCarouselUserItem,
        ]}>
        <Avatar
          name={name}
          themeColor={themeColor}
          entityType={entityTypes.USER}
          thumbnail={thumbnail}
          resizeMode="cover"
          withInitials={false}
          linkable={false}
          imageStyle={styles.avatar}
        />
        <Image
          source={images.people.avatar_mask}
          style={styles.mask}
          resizeMode="stretch"
        />
        <View style={styles.innerWrapper}>
          <TruncatedMultiLineName
            name={name}
            style={styles.userNameWrapper}
            size={13}
            lineHeight={17}
            color={flipFlopColors.white}
            bold
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderViewAllJoinersItem = () => (
    <TouchableOpacity
      onPress={this.navigateToViewAllJoiners}
      activeOpacity={1}
      style={[
        commonStyles.tinyShadow,
        styles.carouselItem,
        styles.viewAllJoinersItem,
      ]}>
      <View style={[styles.innerWrapper, styles.viewAllJoinersInnerWrapper]}>
        <AwesomeIcon
          name="eye"
          weight="solid"
          color={flipFlopColors.azure}
          size={28}
          style={styles.viewAllJoinersIcon}
        />
        <Text
          color={flipFlopColors.azure}
          size={13}
          lineHeight={17}
          bold
          style={commonStyles.textAlignCenter}>
          {I18n.t('posts.community_joined.view_all')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  navigateToViewAllJoiners = () => {
    const {
      minBetweenDate,
      maxBetweenDate,
    } = this.props.data.payload.templateData;
    navigationService.navigate(screenNames.PeopleTab, {
      initialFilters: {
        minCreatedAt: minBetweenDate,
        maxCreatedAt: maxBetweenDate,
      },
    });
  };
}

JoinedYourCommunityPost.propTypes = {
  data: PropTypes.object,
  isPostPage: PropTypes.bool,
  // isAdmin: PropTypes.bool,
};

const mapStateToProps = (state) => ({});

JoinedYourCommunityPost = connect(mapStateToProps)(JoinedYourCommunityPost);
export default JoinedYourCommunityPost;
