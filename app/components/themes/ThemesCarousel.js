import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {ScrollView, View} from '../basicComponents';
import {ThemeCard} from '../themes';
import {commonStyles, flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas/common';

const styles = StyleSheet.create({
  themeCard: {
    marginBottom: 15,
  },
  themeCardsLoadingState: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    overflow: 'hidden',
  },
  themeCardPlaceholder: {
    marginRight: 8,
    width: 90,
    height: 110,
    borderRadius: 15,
    backgroundColor: flipFlopColors.b90,
  },
});

class ThemesCarousel extends Component {
  render() {
    const {themes} = this.props;

    return themes ? this.renderThemes() : this.renderLoadingState();
  }

  renderThemes() {
    const {
      themes,
      themesAreaMargin,
      gapBetweenThemes,
      style,
      cardStyle,
      onThemePress,
      neighborhoodImage,
      neighborhoodName,
      isWithShadow,
    } = this.props;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}>
        {themes.map((theme, index) => {
          const isFirstTheme = index === 0;
          const isLastTheme = index === themes.length - 1;
          const marginLeft = isFirstTheme ? themesAreaMargin : 0;
          const marginRight = isLastTheme ? themesAreaMargin : gapBetweenThemes;

          return (
            <ThemeCard
              key={theme.tag}
              theme={theme.tag}
              count={theme.total}
              onThemePress={onThemePress}
              style={[
                isWithShadow && commonStyles.shadow,
                styles.themeCard,
                cardStyle,
                {marginLeft, marginRight},
              ]}
              neighborhoodImage={neighborhoodImage}
              neighborhoodName={neighborhoodName}
            />
          );
        })}
      </ScrollView>
    );
  }

  renderLoadingState() {
    const {style} = this.props;

    return (
      <View style={[style, styles.themeCardsLoadingState]}>
        {[0, 1, 2, 3].map((index) => this.renderLoadingStateThemeCard({index}))}
      </View>
    );
  }

  renderLoadingStateThemeCard({index}) {
    const {cardStyle} = this.props;
    return (
      <View
        style={[styles.themeCard, cardStyle, styles.themeCardPlaceholder]}
        key={index}
      />
    );
  }
}

ThemesCarousel.defaultProps = {
  themesAreaMargin: 15,
  gapBetweenThemes: 8,
  isWithShadow: true,
};

ThemesCarousel.propTypes = {
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string,
      total: PropTypes.number,
    }),
  ),
  onThemePress: PropTypes.func,
  themesAreaMargin: PropTypes.number,
  gapBetweenThemes: PropTypes.number,
  style: stylesScheme,
  cardStyle: stylesScheme,
  neighborhoodImage: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
  ]),
  neighborhoodName: PropTypes.string,
  isWithShadow: PropTypes.bool,
};

export default ThemesCarousel;
