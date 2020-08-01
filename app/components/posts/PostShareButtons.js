import React from 'react';
import PropTypes from 'prop-types';
import {View, ShareTypeIcon} from '../basicComponents';
import {StyleSheet} from 'react-native';
import {commonStyles, flipFlopColors} from '../../vars';
import {
  shareTypes,
  componentNamesForAnalytics,
  originTypes,
} from '../../vars/enums';

import {ShareableProvider} from '..';

const VISIBLE_SHARE_OPTIONS = [
  shareTypes.FLIPFLOP,
  shareTypes.WHATSAPP,
  shareTypes.FACEBOOK,
  shareTypes.MORE,
];

const styles = StyleSheet.create({
  marginLeft: {
    marginLeft: 8,
  },
  moreIconWrapper: {
    width: 20,
    borderColor: flipFlopColors.white,
  },
});

class PostShareButtons extends React.Component {
  render = () => {
    const {entity, originType} = this.props;
    return (
      <ShareableProvider
        entity={entity}
        originType={originType}
        componentName={componentNamesForAnalytics.POST}>
        {this.renderIcons}
      </ShareableProvider>
    );
  };

  renderIcons = (actionsProps) => (
    <View style={commonStyles.flexDirectionRow}>
      {this.getIcons(actionsProps)}
    </View>
  );

  renderIcon = (
    {
      id,
      action,
      awesomeIconName,
      iconSize,
      iconName,
      iconWeight,
      iconWrapperStyle,
      iconStyle,
      awesomeIconWeight,
    },
    index,
  ) => (
    <ShareTypeIcon
      key={id}
      onPress={action}
      iconName={awesomeIconName || iconName}
      iconSize={iconSize}
      isAwesomeIcon={awesomeIconName}
      style={[
        iconWrapperStyle,
        index > 0 && styles.marginLeft,
        id === shareTypes.MORE && styles.moreIconWrapper,
      ]}
      iconStyle={iconStyle}
      iconWeight={awesomeIconWeight || iconWeight}
    />
  );

  getIcons = ({actionSheet = {}, openShareActionSheet}) =>
    actionSheet.options
      .filter((d) => VISIBLE_SHARE_OPTIONS.includes(d.id))
      .sort(
        (a, b) =>
          VISIBLE_SHARE_OPTIONS.indexOf(a.id) -
          VISIBLE_SHARE_OPTIONS.indexOf(b.id),
      )
      .map((option, index) =>
        this.renderIcon(
          {
            ...option,
            action:
              option.id === shareTypes.MORE
                ? openShareActionSheet
                : option.action,
          },
          index,
        ),
      );
}

PostShareButtons.propTypes = {
  entity: PropTypes.object,
  originType: PropTypes.oneOf(Object.values(originTypes)),
};

export default PostShareButtons;
