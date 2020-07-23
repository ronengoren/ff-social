import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import {connect} from 'react-redux';
import {Chip} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {isRTL} from '../../infra/utils/stringUtils';
import {getThemeUI} from './enums';
import {getThemeTagTranslation} from './utils';

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  mediumCategoryChip: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 9,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumCategoryChipRightAlignText: {
    paddingTop: 8,
    paddingBottom: 7,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallCategoryChip: {
    paddingHorizontal: 11,
    paddingTop: 6,
    paddingBottom: 6,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallCategoryChipRightAlignText: {
    paddingTop: 5,
    paddingBottom: 4,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumCategoryChipText: {
    writingDirection: 'rtl',
    textAlign: 'left',
    lineHeight: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallCategoryChipText: {
    writingDirection: 'rtl',
    textAlign: 'left',
    lineHeight: 15,
    fontSize: 12,
  },
  arrowIcon: {
    marginTop: 3,
  },
  iOSRightAlignedTextArrow: {
    marginTop: 1,
  },
});

class ThemeChip extends Component {
  static sizes = {
    small: 'small',
    medium: 'medium',
  };

  render() {
    const {theme, size, withArrow, onPress, community} = this.props;
    const themeUIDefinition = getThemeUI(theme);
    const themeName = getThemeTagTranslation({theme, community});
    const isTitleAlignRight = isRTL(themeName);
    const afterTextComponent = withArrow ? (
      <AwesomeIcon
        name="angle-right"
        size={size === ThemeChip.sizes.small ? 12 : 15}
        color={flipFlopColors.white}
        weight="solid"
        style={[
          styles.arrowIcon,
          isTitleAlignRight &&
            Platform.OS === 'ios' &&
            styles.iOSRightAlignedTextArrow,
        ]}
      />
    ) : null;

    return (
      <Chip
        onPress={() =>
          onPress({theme, themeColor: themeUIDefinition.backgroundColor})
        }
        active
        style={[
          styles[`${size}CategoryChip`],
          isTitleAlignRight && styles[`${size}CategoryChipRightAlignText`],
        ]}
        color={themeUIDefinition.backgroundColor}
        textStyle={styles[`${size}CategoryChipText`]}
        afterTextComponent={afterTextComponent}>
        {` ${themeName} `}
      </Chip>
    );
  }
}

ThemeChip.defaultProps = {
  size: ThemeChip.sizes.medium,
};

ThemeChip.propTypes = {
  theme: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  withArrow: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(ThemeChip.sizes)),
  community: PropTypes.shape({
    destinationPartitionLevel: PropTypes.string,
  }),
};

const mapStateToProps = (state) => ({
  community: state.auth.user.community,
});

ThemeChip = connect(mapStateToProps)(ThemeChip);
export default ThemeChip;
