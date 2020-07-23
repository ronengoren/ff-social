import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Image} from '../../basicComponents';
import {flipFlopColors, commonStyles} from '../../../vars';

const HITSLOP = {left: 5, top: 15, right: 5, bottom: 15};

const styles = StyleSheet.create({
  bottomText: {
    paddingRight: 5,
    paddingLeft: 17,
    backgroundColor: flipFlopColors.transparent,
  },
  clapImage: {
    width: 14,
    height: 15,
  },
});

const ThanksCounter = ({likes, onPress, imageSrc}) => (
  <TouchableOpacity
    hitSlop={HITSLOP}
    onPress={likes ? onPress : null}
    activeOpacity={1}
    style={commonStyles.flexDirectionRow}>
    <Text
      size={13}
      lineHeight={15}
      style={styles.bottomText}
      color={likes ? flipFlopColors.azure : flipFlopColors.b60}
      hitSlop={HITSLOP}>
      {likes}
    </Text>
    <Image source={imageSrc} style={styles.clapImage} />
  </TouchableOpacity>
);

ThanksCounter.propTypes = {
  likes: PropTypes.number,
  onPress: PropTypes.func,
  imageSrc: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
};

export default ThanksCounter;
