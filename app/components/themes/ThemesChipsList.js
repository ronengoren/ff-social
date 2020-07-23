import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView} from '/components/basicComponents';
import {ThemeChip, MY_HOOD} from '../../components/themes';
import {screenNames, originTypes} from '../../vars/enums';
import {stylesScheme} from '../../schemas';
import {navigationService} from '../../infra/navigation';

class ThemesChipsList extends React.Component {
  render() {
    const {themes, chipSize, style} = this.props;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={style}>
        {themes.map((theme) => (
          <ThemeChip
            key={theme}
            theme={theme}
            onPress={this.navigateToThemePage}
            size={chipSize}
            withArrow
          />
        ))}
      </ScrollView>
    );
  }

  navigateToThemePage = ({theme}) => {
    const {isShowSaved, originType, preNavAction} = this.props;
    preNavAction && preNavAction();

    if (theme === MY_HOOD) {
      navigationService.navigate(screenNames.MyNeighborhoodView, {isShowSaved});
    } else {
      navigationService.navigate(screenNames.MyThemeView, {
        theme,
        originType,
        isShowSaved,
      });
    }
  };
}

ThemesChipsList.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.string).isRequired,
  isShowSaved: PropTypes.bool,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  chipSize: PropTypes.oneOf(Object.values(ThemeChip.sizes)),
  style: stylesScheme,
  preNavAction: PropTypes.func,
};

export default ThemesChipsList;
