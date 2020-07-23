import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {stylesScheme} from '../../../schemas';
import {Text} from '../../basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors, commonStyles} from '../../../vars';

const HITSLOP = {left: 5, top: 15, right: 5, bottom: 15};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 17,
  },
  bottomText: {
    paddingRight: 5,
    backgroundColor: flipFlopColors.transparent,
  },
  iconComment: {
    marginTop: 2,
  },
});

const CommentsCounter = ({comments, onPress, style}) => (
  <TouchableOpacity
    hitSlop={HITSLOP}
    onPress={onPress}
    activeOpacity={1}
    style={[commonStyles.flexDirectionRow, styles.container, style]}>
    {!!comments && (
      <Text
        size={13}
        lineHeight={15}
        style={styles.bottomText}
        color={comments ? flipFlopColors.azure : flipFlopColors.b60}
        hitSlop={HITSLOP}>
        {comments}
      </Text>
    )}
    <AwesomeIcon
      name="comment-alt"
      weight="solid"
      style={[styles.iconComment]}
      color={comments ? flipFlopColors.azure : flipFlopColors.b60}
      size={12}
    />
  </TouchableOpacity>
);

CommentsCounter.propTypes = {
  style: stylesScheme,
  comments: PropTypes.number,
  onPress: PropTypes.func,
};

export default CommentsCounter;
