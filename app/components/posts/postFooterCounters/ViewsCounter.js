import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text} from '../../basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors, commonStyles} from '../../../vars';
import {numberWithCommas} from '../../../infra/utils/stringUtils';

const HITSLOP = {left: 5, top: 15, right: 5, bottom: 15};

const styles = StyleSheet.create({
  bottomText: {
    paddingRight: 5,
    paddingLeft: 17,
    backgroundColor: flipFlopColors.transparent,
  },
});

const ViewsCounter = ({views}) => (
  <View style={commonStyles.flexDirectionRow}>
    <Text
      size={13}
      lineHeight={15}
      style={styles.bottomText}
      color={flipFlopColors.b60}
      hitSlop={HITSLOP}>
      {numberWithCommas(views)}
    </Text>
    <AwesomeIcon
      name="eye"
      color={flipFlopColors.b60}
      size={13}
      weight="solid"
    />
  </View>
);

ViewsCounter.propTypes = {
  views: PropTypes.number,
};

export default ViewsCounter;
