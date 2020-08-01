import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {
  SearchMentionsResults,
  SearchResultRowHeight,
} from '../../../../components';
import {View, IconButton} from '../../../../components/basicComponents';
import {flipFlopColors, commonStyles, uiConstants} from '../../../../vars';
import {mediaTypes, postTypes} from '../../../../vars/enums';
import {searchMentionsScheme} from '../../../../schemas';

const mentionsContainerHeight = SearchResultRowHeight * 3;

const styles = StyleSheet.create({
  mentionsContainer: {
    flex: 0,
    backgroundColor: flipFlopColors.white,
    height: mentionsContainerHeight,
    justifyContent: 'flex-end',
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 70,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 15,
    backgroundColor: flipFlopColors.white,
  },
  icon: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    borderRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  spacedIcon: {
    marginHorizontal: 10,
  },
});

class BottomSection extends Component {
  render() {
    const {
      searchMentions: {results, isSearching},
      postType,
      withMentions,
    } = this.props;
    const isShowMediaButtons = ![postTypes.GUIDE, postTypes.JOB].includes(
      postType,
    );

    if (results && (results.length || isSearching) && withMentions) {
      return (
        <View style={styles.mentionsContainer}>
          <SearchMentionsResults />
        </View>
      );
    } else {
      return isShowMediaButtons && this.renderMediaButtons();
    }
  }

  renderMediaButtons() {
    const {
      onAddMedia,
      withImages,
      withVideos,
      onAddSchedule,
      withSchedule,
      isScheduledPost,
    } = this.props;
    return (
      <View style={styles.mediaButtons}>
        {withImages && (
          <IconButton
            iconSize={22}
            isAwesomeIcon
            name="camera"
            weight="solid"
            iconColor="b30"
            style={[styles.icon, commonStyles.smallShadow]}
            onPress={() => onAddMedia(mediaTypes.IMAGE)}
          />
        )}
        {withVideos && (
          <IconButton
            iconSize={22}
            isAwesomeIcon
            name="video"
            weight="solid"
            iconColor="b30"
            style={[styles.icon, styles.spacedIcon, commonStyles.smallShadow]}
            onPress={() => onAddMedia(mediaTypes.VIDEO)}
          />
        )}
        {withSchedule && (
          <IconButton
            iconSize={22}
            isAwesomeIcon
            name="clock"
            weight="solid"
            iconColor={isScheduledPost ? 'azure' : 'b30'}
            style={[styles.icon, commonStyles.smallShadow]}
            onPress={onAddSchedule}
          />
        )}
      </View>
    );
  }
}

BottomSection.defaultProps = {
  withMentions: true,
};

BottomSection.propTypes = {
  withImages: PropTypes.bool,
  withVideos: PropTypes.bool,
  withSchedule: PropTypes.bool,
  withMentions: PropTypes.bool,
  searchMentions: searchMentionsScheme,
  onAddMedia: PropTypes.func,
  onAddSchedule: PropTypes.func,
  isScheduledPost: PropTypes.bool,
  postType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  searchMentions: state.mentions.searchMentions,
});

export default connect(mapStateToProps)(BottomSection);
