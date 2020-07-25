import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {HomeisIcon} from '../../assets/icons';
import {stylesScheme} from '../../schemas';

const styles = {
  wrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 150,
    paddingBottom: 350,
    backgroundColor: flipFlopColors.fillGrey,
  },
  header: {
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
    color: flipFlopColors.buttonGrey,
    marginBottom: 10,
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    color: flipFlopColors.buttonGrey,
    marginBottom: 30,
  },
};

const EmptyList = ({
  style,
  title,
  text,
  iconName,
  iconSize,
  imageSrc,
  imageStyle,
}) => (
  <View style={[styles.wrapper, style]}>
    {iconName && (
      <HomeisIcon
        name={iconName}
        color={flipFlopColors.buttonGrey}
        size={iconSize}
        style={styles.icon}
      />
    )}
    {imageSrc && (
      <Image source={imageSrc} resizemode="cover" style={imageStyle} />
    )}
    <Text style={styles.header} medium>
      {title}
    </Text>
    <Text style={styles.text}>{text}</Text>
  </View>
);

EmptyList.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  style: stylesScheme,
  imageSrc: PropTypes.number,
  imageStyle: stylesScheme,
};

export default EmptyList;
