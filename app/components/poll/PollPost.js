import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {navigationService} from '../../infra/navigation';
// import { analytics } from '/infra/reporting';
import {PostFooter, HtmlText} from '../../components';
import {PostActionSheetButton} from '../../components/posts';
import {View, Text, DashedBorder} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {isRTL} from '../../infra/utils/stringUtils';
import {screenNames, listPermissions, itemsSortTypes} from '../../vars/enums';
import images from '../../assets/images';
import ItemCtaHeader from '../../components/feed/ItemCtaHeader';
import PollItems from './PollItems';

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
  contentWrapper: {
    paddingHorizontal: 15,
    marginTop: 16,
    marginBottom: 14,
  },
  separator: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  dashedBorder: {
    marginVertical: 12,
  },
  descriptionText: {
    ...commonStyles.textAlignCenter,
    fontSize: 18,
    lineHeight: 24,
    color: flipFlopColors.b30,
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 0,
  },
  rtlMenuButton: {
    left: 0,
  },
  seeMoreText: {
    textAlign: 'center',
    color: flipFlopColors.azure,
  },
  viewMoreContainer: {
    marginTop: 14,
  },
});

class PollPost extends React.Component {
  render() {
    const {data, isPostPage, maxVisibleItems} = this.props;

    return (
      <View
        style={[
          styles.wrapper,
          isPostPage && styles.postPageWrapper,
          commonStyles.shadow,
        ]}>
        {this.renderPollHeader()}
        <PollItems
          isPostPage={isPostPage}
          data={data}
          maxVisibleItems={maxVisibleItems}
          onSelectionPress={() => {}}
          ListFooterComponent={this.renderSeeMoreFooter()}
        />
        <View style={styles.separator}>
          <DashedBorder />
        </View>
        <PostFooter post={data} isPostPage={isPostPage} />
      </View>
    );
  }

  renderPollHeader = () => {
    const {data, appUserId, isPostPage} = this.props;

    const {
      sharedEntity: {entity},
      payload = {},
    } = data;
    const {text} = payload;
    const {
      name: listName,
      description: listDescription,
      creator,
      hasPermissions,
      media,
    } = entity;
    const isAppUserPostCreator =
      creator.id === appUserId || hasPermissions.includes(listPermissions.EDIT);
    const isHeaderRtl = listName && isRTL(listName);

    return (
      <TouchableWithoutFeedback onPress={this.navigateToList}>
        <View>
          <ItemCtaHeader
            isPostPage={isPostPage}
            withCreatorAvatar={false}
            isTitleBold
            mediaUrl={media.url}
            mediaSource={images.common.gradientGreenWithFlipFlopLogo}
          />
          {isAppUserPostCreator && (
            <View
              style={[styles.menuButton, isHeaderRtl && styles.rtlMenuButton]}>
              <PostActionSheetButton isPostPage={isPostPage} post={data} />
            </View>
          )}

          <View style={styles.contentWrapper}>
            <Text
              size={28}
              lineHeight={32}
              color={flipFlopColors.b30}
              bold
              style={commonStyles.textAlignCenter}>
              {listName}
            </Text>
            <DashedBorder style={styles.dashedBorder} />
            <HtmlText
              lineHeight={24}
              value={text || listDescription}
              textStyle={styles.descriptionText}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  renderSeeMoreFooter = () => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => this.navigateToList(true)}
      style={styles.viewMoreContainer}>
      <Text size={16} lineHeight={20} style={styles.seeMoreText}>
        {I18n.t('posts.list_poll.see_more')}
      </Text>
    </TouchableOpacity>
  );

  navigateToList = (isClickedOnViewMore) => {
    // const { data } = this.props;
    // const {
    //   sharedEntity: { entityId, entity }
    // } = data;
    // navigationService.navigate(screenNames.ListView, { entityId, initialSortBy: itemsSortTypes.VOTERS });
    // isClickedOnViewMore && analytics.actionEvents.listClickViewMore({ listId: entity.id, listName: entity.name }).dispatch();
  };
}

PollPost.propTypes = {
  maxVisibleItems: PropTypes.number,
  appUserId: PropTypes.string,
  data: PropTypes.object,
  isPostPage: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  appUserId: state.auth.user.id,
});

const mapDispatchToProps = {};

PollPost = connect(mapStateToProps, mapDispatchToProps)(PollPost);
export default PollPost;
