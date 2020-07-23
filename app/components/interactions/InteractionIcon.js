import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Image} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';
import images from '../../assets/images';

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.white,
  },
  border: {
    borderColor: flipFlopColors.b90,
    borderWidth: 1,
  },
  upperIcon: {
    position: 'absolute',
  },
});

const InteractionIcon = ({
  style,
  iconName,
  iconSize,
  iconColor,
  buttonSize,
  withShadow,
  withBorder,
  isBoardsInteraction,
}) => (
  <View
    style={[
      style,
      styles.iconWrapper,
      withShadow && commonStyles.smallShadow,
      withBorder && styles.border,
      {width: buttonSize, height: buttonSize, borderRadius: buttonSize},
    ]}>
    {isBoardsInteraction ? (
      <Image
        source={images.interactions.indicators[iconName]}
        style={{width: iconSize}}
        resizeMode="contain"
      />
    ) : (
      <React.Fragment>
        <AwesomeIcon
          name={iconName}
          size={iconSize}
          color={iconColor}
          weight="solid"
        />
        <AwesomeIcon
          name={iconName}
          size={iconSize}
          color={flipFlopColors.b30}
          weight="light"
          style={styles.upperIcon}
        />
      </React.Fragment>
    )}
  </View>
);

InteractionIcon.defaultProps = {
  buttonSize: 25,
  iconSize: 20,
  withShadow: false,
  withBorder: false,
};

InteractionIcon.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  buttonSize: PropTypes.number,
  isBoardsInteraction: PropTypes.bool,
  withShadow: PropTypes.bool,
  withBorder: PropTypes.bool,
};

export default InteractionIcon;
