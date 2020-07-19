import React from 'react';
import {useSelector} from 'react-redux';
import {flipFlopColors} from '../../vars';
import {screenNames} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import HeaderIndicator from './HeaderIndicator';

function SavedThemesIndicator() {
  const savedThemes = useSelector(
    (state) => get(state, 'themes.savedThemes') || [],
  );
  const numOfSavedItems = savedThemes.reduce(
    (acc, item) => acc + item.total,
    0,
  );

  const navigateToSavedItems = () => {
    navigationService.navigate(screenNames.SavedItemsView, {numOfSavedItems});
  };

  return (
    <HeaderIndicator
      count={numOfSavedItems}
      action={navigateToSavedItems}
      iconName="bookmark"
      badgeColor={flipFlopColors.green}
    />
  );
}

export default SavedThemesIndicator;
