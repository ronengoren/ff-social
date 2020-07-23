import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import {View, Text, Image} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';
import {isHebrewOrArabic} from '../../infra/utils/stringUtils';
import images from '../../assets/images';
import {getThemeUI, MY_HOOD} from './enums';
import {getThemeTagTranslation} from './utils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 110,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  icons: {
    marginTop: 11,
    paddingHorizontal: 11,
    flexDirection: 'row',
  },
  texts: {
    paddingHorizontal: 10,
    paddingBottom: 7,
  },
  secondIcon: {
    marginLeft: 1,
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: flipFlopColors.boxShadow,
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: flipFlopColors.halfLightWhite,
  },
  checkedCheckbox: {
    borderColor: flipFlopColors.white,
    backgroundColor: flipFlopColors.realBlack40,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
});

class ThemeCard extends React.Component {
  themeUIDefinition = getThemeUI(this.props.theme);

  render() {
    const {
      theme,
      count,
      style,
      withSelection,
      isSelected,
      community,
    } = this.props;
    const isMyHood = theme === MY_HOOD;
    const themeTranslation = getThemeTagTranslation({theme, community});
    const isHebrew = isHebrewOrArabic(themeTranslation);

    return (
      <TouchableOpacity
        style={[
          styles.container,
          style,
          {backgroundColor: this.themeUIDefinition.backgroundColor},
        ]}
        onPress={this.handlePress}
        activeOpacity={1}>
        {isMyHood && this.renderMyHoodImage()}
        <View style={styles.icons}>
          <AwesomeIcon
            name={this.themeUIDefinition.iconName}
            color={flipFlopColors.white}
            size={20}
          />
          {!!this.themeUIDefinition.secondIconName && (
            <AwesomeIcon
              name={this.themeUIDefinition.secondIconName}
              color={flipFlopColors.white}
              size={20}
              style={styles.secondIcon}
            />
          )}
          {withSelection && (
            <View
              style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
              {isSelected && (
                <AwesomeIcon
                  name="check"
                  color={flipFlopColors.white}
                  size={13}
                  weight="solid"
                />
              )}
            </View>
          )}
        </View>
        <View style={styles.texts}>
          {!isMyHood && !!count && (
            <Text color={flipFlopColors.white} size={11} lineHeight={16}>
              {count}
            </Text>
          )}
          <Text
            bold
            color={flipFlopColors.white}
            size={isHebrew ? 15 : 14}
            lineHeight={17}
            forceLTR>
            {themeTranslation}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderMyHoodImage = () => {
    const {neighborhoodImage} = this.props;
    const resizeMode = Platform.OS === 'ios' ? 'stretch' : 'cover'; // Android has a bug with borderRadius and 'strech' mode

    if (neighborhoodImage) {
      return [
        <Image
          source={neighborhoodImage}
          style={styles.backgroundImage}
          key="themeCardImage"
        />,
        <Image
          source={images.common.gradientDownTop}
          style={styles.backgroundImage}
          key="themeCardGradientImage"
          resizeMode={resizeMode}
        />,
      ];
    }

    return (
      <Image
        source={images.neighborhood.default}
        style={styles.backgroundImage}
      />
    );
  };

  handlePress = () => {
    const {theme, onThemePress} = this.props;
    onThemePress &&
      onThemePress({theme, themeColor: this.themeUIDefinition.backgroundColor});
  };
}

ThemeCard.propTypes = {
  theme: PropTypes.string.isRequired,
  count: PropTypes.number,
  style: stylesScheme,
  onThemePress: PropTypes.func,
  withSelection: PropTypes.bool,
  isSelected: PropTypes.bool,
  neighborhoodImage: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
  ]),
  community: PropTypes.shape({
    destinationLocation: PropTypes.array,
    destinationCountryCode: PropTypes.string,
    destinationPartitionLevel: PropTypes.string,
  }),
};

const mapStateToProps = (state) => ({
  community: state.auth.user.community,
});

ThemeCard = connect(mapStateToProps)(ThemeCard);
export default ThemeCard;
