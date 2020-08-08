import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text, Avatar} from '../../../../components/basicComponents';
import {mentionUtils, HtmlText} from '../../../../components';
import {HomeisIcon} from '../../../../assets/icons';
import {flipFlopColors} from '../../../../vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: flipFlopColors.white,
    borderRadius: 5,
    shadowColor: flipFlopColors.clearBlack,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  previewImageWrapper: {
    height: 80,
    width: 81,
    flexDirection: 'row',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
  },
  avatar: {
    borderRadius: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  videoIconBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: flipFlopColors.paleBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  videoIcon: {
    color: flipFlopColors.white,
  },
  previewImageSeparator: {
    height: 80,
    width: 1,
    backgroundColor: flipFlopColors.disabledGrey,
  },
  previewTextWrapper: {
    flex: 1,
    padding: 10,
  },
  previewTitle: {
    letterSpacing: 0.2,
    color: flipFlopColors.black,
    marginBottom: 2,
  },
  previewText: {
    height: 20,
    marginBottom: 3,
  },
  previewDomain: {
    height: 15,
    lineHeight: 15,
    color: flipFlopColors.b30,
  },
});

const EntityPreview = ({
  title,
  subtitle = '',
  longSubtitle = false,
  subtitleMentions = [],
  detailsText,
  imageUrl,
  videoPreview,
  name,
  themeColor,
}) => {
  const hasImage = !!imageUrl || !!name;
  const enrichedSubtitle = mentionUtils.enrichText({
    subtitle,
    subtitleMentions,
  });

  return (
    <View style={styles.container}>
      {hasImage && (
        <View style={styles.previewImageWrapper}>
          {(!!imageUrl || !!name) && (
            <Avatar
              size="extraBig"
              name={name}
              themeColor={themeColor}
              thumbnail={imageUrl}
              resizeMode="cover"
              linkable={false}
              imageStyle={styles.avatar}
            />
          )}
          {videoPreview && (
            <View style={styles.videoIconBackground}>
              <HomeisIcon name="play" style={styles.videoIcon} size={30} />
            </View>
          )}
          <View style={styles.previewImageSeparator} />
        </View>
      )}
      <View style={styles.previewTextWrapper}>
        {!!title && (
          <Text numberOfLines={1} style={styles.previewTitle} bold>
            {title}
          </Text>
        )}
        {!!subtitle && !longSubtitle && (
          <HtmlText
            showTranslateButton={false}
            numberOfLines={1}
            style={styles.previewText}
            value={enrichedSubtitle}
          />
        )}
        {!!subtitle && longSubtitle && (
          <Text numberOfLines={2}>{subtitle}</Text>
        )}
        {!!detailsText && (
          <Text numberOfLines={1} style={styles.previewDomain}>
            {detailsText}
          </Text>
        )}
      </View>
    </View>
  );
};

EntityPreview.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subtitleMentions: PropTypes.array,
  detailsText: PropTypes.string,
  imageUrl: PropTypes.string,
  videoPreview: PropTypes.bool,
  name: PropTypes.string,
  themeColor: PropTypes.string,
  longSubtitle: PropTypes.bool,
};

export default EntityPreview;
