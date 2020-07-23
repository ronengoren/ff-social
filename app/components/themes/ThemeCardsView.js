import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions} from 'react-native';
import {View} from '../basicComponents';
import {ThemeCard} from '../themes';
import {stylesScheme} from '../../schemas';
import {GAP_BETWEEN_THEMES} from './uiConsts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const THEMES_ROW_INNER_PADDINGS = GAP_BETWEEN_THEMES * 2;
const THEMES_CARDS_IN_ROW = 3;

class ThemeCardsView extends Component {
  render() {
    const {
      themes,
      style,
      onThemePress,
      selectedThemes,
      horizontalMargins,
      withSelection,
      neighborhoodImage,
      neighborhoodName,
    } = this.props;
    const {width: screenWidth} = Dimensions.get('window');
    const width =
      (screenWidth - horizontalMargins - THEMES_ROW_INNER_PADDINGS) /
      THEMES_CARDS_IN_ROW;

    return (
      <View style={[styles.container, style]}>
        {themes.map((theme, index) => {
          const isLastThemeInRow = (index + 1) % THEMES_CARDS_IN_ROW === 0;
          const marginRight = isLastThemeInRow ? 0 : GAP_BETWEEN_THEMES;

          return (
            <ThemeCard
              withSelection={withSelection}
              theme={theme.tag}
              key={theme.tag}
              count={theme.total}
              style={{width, marginRight}}
              onThemePress={onThemePress}
              isSelected={selectedThemes && selectedThemes.includes(theme.tag)}
              neighborhoodImage={neighborhoodImage}
              neighborhoodName={neighborhoodName}
            />
          );
        })}
      </View>
    );
  }
}

ThemeCardsView.propTypes = {
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string,
      total: PropTypes.number,
    }),
  ).isRequired,
  selectedThemes: PropTypes.arrayOf(PropTypes.string),
  style: stylesScheme,
  onThemePress: PropTypes.func,
  withSelection: PropTypes.bool,
  horizontalMargins: PropTypes.number.isRequired,
  neighborhoodImage: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
  ]),
  neighborhoodName: PropTypes.string,
};

export default ThemeCardsView;
