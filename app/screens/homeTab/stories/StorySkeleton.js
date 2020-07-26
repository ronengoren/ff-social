import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image, View, IconButton} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import images from '../../../assets/images';

import {stylesScheme} from '/schemas';

const styles = StyleSheet.create({
  story: {
    marginLeft: 15,
    width: 180,
    height: 210,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  shadow: {
    backgroundColor: flipFlopColors.white,
    shadowColor: flipFlopColors.b90,
    shadowOffset: {
      width: -3,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 4,
  },
  backgroundGrad: {
    position: 'absolute',
  },
  text: {
    flexDirection: 'column',
    marginTop: 'auto',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  more: {
    position: 'absolute',
    start: 10,
    top: 10,
    width: 32,
    height: 20,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.white,
    backgroundColor: flipFlopColors.semiDarkRealBlack,
  },
});

const StorySkeleton = ({
  style,
  imageSource,
  textComponent,
  preTextComponent,
  onPress,
  onMenuClick,
  isAdmin,
}) => (
  <TouchableOpacity
    style={[styles.story, styles.shadow, style]}
    onPress={onPress}
    activeOpacity={0.85}>
    {imageSource && (
      <Image
        source={{uri: imageSource}}
        style={styles.background}
        resizeMode="cover"
      />
    )}
    {imageSource && (
      <Image
        source={images.stories.background_gradient}
        resizeMode="cover"
        style={[styles.background, styles.backgroundGrad]}
      />
    )}
    {isAdmin && onMenuClick && (
      <View style={styles.more}>
        <IconButton
          onPress={onMenuClick}
          isAwesomeIcon
          iconColor="white"
          iconSize={30}
          name="ellipsis-h"
        />
      </View>
    )}
    <View style={styles.text}>
      {preTextComponent}
      {textComponent}
    </View>
  </TouchableOpacity>
);

StorySkeleton.propTypes = {
  style: stylesScheme,
  imageSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  textComponent: PropTypes.node.isRequired,
  preTextComponent: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  onMenuClick: PropTypes.func,
  isAdmin: PropTypes.bool,
};

export default StorySkeleton;
