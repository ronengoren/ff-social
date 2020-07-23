import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text, Image} from '../basicComponents';
import {HomeisIcon, AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 250,
    paddingHorizontal: 60,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateHeader: {
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateText: {
    textAlign: 'center',
  },
});

class GenericEmptyState extends React.Component {
  render() {
    const {
      image,
      imageStyle,
      resizeMode,
      headerText,
      bodyText,
      style,
      isHomeisIcon,
      IconComponent,
      iconName,
    } = this.props;
    const Icon = isHomeisIcon ? HomeisIcon : AwesomeIcon;
    return (
      <View style={[styles.container, style]}>
        <View style={styles.innerContainer}>
          {!!image && (
            <Image source={image} style={imageStyle} resizeMode={resizeMode} />
          )}
          {IconComponent ||
            (iconName && (
              <Icon
                name={iconName}
                size={80}
                color={flipFlopColors.b90}
                style={styles.emptyStateIcon}
                weight="solid"
              />
            ))}
          <Text
            size={22}
            lineHeight={30}
            color={flipFlopColors.b60}
            medium
            style={styles.emptyStateHeader}>
            {headerText}
          </Text>
          {!!bodyText && (
            <Text
              size={15}
              lineHeight={22}
              color={flipFlopColors.b60}
              medium
              style={styles.emptyStateText}>
              {bodyText}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

GenericEmptyState.propTypes = {
  imageStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  image: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
  ]),
  resizeMode: PropTypes.string,
  isHomeisIcon: PropTypes.bool,
  IconComponent: PropTypes.element,
  iconName: PropTypes.string,
  headerText: PropTypes.string,
  bodyText: PropTypes.string,
  style: stylesScheme,
};

export default GenericEmptyState;
