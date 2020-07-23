import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Image} from '../basicComponents';
import {HomeisIcon} from '../../assets/icons';
import images from '../../assets/images';
import {flipFlopColors} from '../../vars';
import {entityTypes} from '../../vars/enums';
import {stylesScheme} from '../../schemas/common';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: flipFlopColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  extraSmallImage: {
    width: 60,
    height: 65,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallImage: {
    width: 76,
    height: 80,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumImage: {
    width: 100,
    height: 105,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  bigImage: {
    width: '100%',
    height: '100%',
  },
  badgeOuter: {
    position: 'absolute',
    top: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: flipFlopColors.white,
  },
  badgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: flipFlopColors.pinkishRed,
  },
  badgeIcon: {
    lineHeight: 18,
    marginLeft: 1,
  },
});

const EntityImagePlaceholder = ({
  postType,
  entityType,
  size = EntityImagePlaceholder.sizes.EXTRA_SMALL,
  showBadge,
  containerStyle,
  resizeMode,
}) => (
  <View style={[styles.container, containerStyle]}>
    <Image
      source={images.entityImagePlaceholders[postType || entityType]}
      style={styles[`${size}Image`]}
      resizeMode={resizeMode}
    />
    {showBadge && (
      <View style={styles.badgeOuter}>
        <View style={styles.badgeInner}>
          <HomeisIcon
            name="star"
            size={16}
            color={flipFlopColors.white}
            style={styles.badgeIcon}
          />
        </View>
      </View>
    )}
  </View>
);

EntityImagePlaceholder.sizes = {
  EXTRA_SMALL: 'extraSmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  BIG: 'big',
};

EntityImagePlaceholder.propTypes = {
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  postType: PropTypes.string,
  resizeMode: PropTypes.string,
  size: PropTypes.oneOf(Object.values(EntityImagePlaceholder.sizes)),
  showBadge: PropTypes.bool,
  containerStyle: stylesScheme,
};

export default EntityImagePlaceholder;
