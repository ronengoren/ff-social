import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View, Text, IconButton} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../../vars';

const styles = StyleSheet.create({
  icon: {
    marginLeft: 15,
  },
  box: {
    justifyContent: 'center',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  innerBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const ActionBox = ({
  onPress,
  boxColor,
  borderColor,
  rightComponent,
  color,
  title,
  titleColor,
  text,
  icons,
  iconsColor = 'b70',
  containerStyle,
  testID,
}) => (
  <View
    style={[
      styles.box,
      {borderColor, backgroundColor: boxColor || flipFlopColors.paleGreyTwo},
      containerStyle,
    ]}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <View style={styles.innerBoxContent} testID={testID}>
        <View style={commonStyles.flex1}>
          {title && (
            <Text size={16} lineHeight={24} color={titleColor} bold>
              {title}
            </Text>
          )}
          {text && (
            <Text size={16} lineHeight={24} color={flipFlopColors.b30}>
              {text}
            </Text>
          )}
        </View>
        {rightComponent}
        {icons &&
          icons.map((icon) => (
            <IconButton
              key={icon}
              style={styles.icon}
              isAwesomeIcon
              name={icon}
              iconColor={iconsColor || color}
              iconSize={22}
            />
          ))}
      </View>
    </TouchableOpacity>
  </View>
);

ActionBox.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  borderColor: PropTypes.string,
  boxColor: PropTypes.string,
  color: PropTypes.string,
  titleColor: PropTypes.string,
  text: PropTypes.string,
  icons: PropTypes.array,
  iconsColor: PropTypes.string,
  rightComponent: PropTypes.node,
  containerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  testID: PropTypes.string,
};

ActionBox.defaultProps = {
  titleColor: flipFlopColors.b30,
  borderColor: flipFlopColors.transparent,
};

export default ActionBox;
