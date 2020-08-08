import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import I18n from '../infra/localization';
import {View, Text} from './basicComponents';
import {AwesomeIcon} from '../assets/icons';
import {flipFlopColors, uiConstants} from '../vars';
import {
  postTypes,
  uiDefinitions,
  uiColorDefinitions,
  myCityTabs,
} from '../vars/enums';
import {navigateToPostType} from '../infra/navigation/utils';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 5,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  smallScreenWrapper: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 5,
    paddingRight: 0,
  },
  itemWrapper: {
    alignItems: 'center',
    flex: 1,
    flexBasis: 90,
    height: 80,
    marginBottom: 10,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  smallScreenItemWrapper: {
    marginRight: 5,
  },
  itemIconWrapper: {
    width: 30,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  separator: {
    flex: 1,
    height: 1,
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  separatorInner: {
    width: '100%',
    height: 1,
    backgroundColor: flipFlopColors.b90,
  },
});

const iconSizes = {
  [postTypes.TIP_REQUEST]: 22,
  [postTypes.GUIDE]: 20,
  [postTypes.JOB]: 25,
  [postTypes.REAL_ESTATE]: 23,
  [postTypes.GIVE_TAKE]: 24,
  [postTypes.PROMOTION]: 22,
  pages: 21,
  lists: 22,
};

const additionalTypes = {
  lists: {
    icon: 'list-ul',
    color: flipFlopColors.pinkishRed,
  },
};

class EnhancedHeader extends React.Component {
  render() {
    const {showSeparator} = this.props;
    const screenHeight = Dimensions.get('window').height;
    const smallScreen = screenHeight <= uiConstants.NORMAL_DEVICE_HEIGHT;
    return [
      <View
        style={[styles.wrapper, smallScreen && styles.smallScreenWrapper]}
        key="enhancedHeader">
        {this.renderHeaderElements(smallScreen)}
      </View>,
      showSeparator && (
        <View style={styles.separator} key="enhancedHeaderSeparator">
          <View style={styles.separatorInner} />
        </View>
      ),
    ];
  }

  componentDidUpdate(prevProps) {
    const {totals, headerItems} = this.props;
    const isIOS = Platform.OS === 'ios';
    if (
      isIOS &&
      (prevProps.totals !== totals || prevProps.headerItems !== headerItems)
    ) {
      LayoutAnimation.easeInEaseOut();
    }
  }

  renderHeaderElements = (smallScreen) => {
    const {totals, headerItems} = this.props;
    return headerItems.map((key) => {
      if (totals !== null && !totals[key]) {
        return null;
      }
      const totalsData = totals || {};
      let icon = uiDefinitions[key] && uiDefinitions[key].name;
      let color = uiColorDefinitions[key];
      let total = totalsData[key];
      if (additionalTypes[key]) {
        ({icon, color} = additionalTypes[key]);
        total = null;
        if (totalsData[key]) {
          total = totalsData[key];
        }
      }
      const size = iconSizes[key];
      return (
        <TouchableOpacity
          onPress={this.navigateToWrapper({postType: key})}
          style={[
            styles.itemWrapper,
            smallScreen && styles.smallScreenItemWrapper,
          ]}
          activeOpacity={1}
          key={`element${key}`}>
          <View style={styles.itemIconWrapper}>
            <AwesomeIcon name={icon} color={color} size={size} weight="solid" />
          </View>
          <View style={styles.textWrapper}>
            <Text
              size={14}
              color={flipFlopColors.realBlack}
              lineHeight={16}
              numberOfLines={1}>
              {I18n.t(`feed.header_buttons.${key}`)}
            </Text>
            {!!total && (
              <Text size={14} color={flipFlopColors.b60} lineHeight={16}>
                ({total})
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  navigateToWrapper = ({postType}) => () => {
    const {contextId} = this.props;

    navigateToPostType(postType, contextId);
  };
}

EnhancedHeader.propTypes = {
  headerItems: PropTypes.arrayOf(
    PropTypes.oneOf([
      myCityTabs.LISTS,
      postTypes.TIP_REQUEST,
      postTypes.GUIDE,
      postTypes.JOB,
      postTypes.REAL_ESTATE,
      postTypes.GIVE_TAKE,
      postTypes.PROMOTION,
      postTypes.RECOMMENDATION,
    ]),
  ),
  totals: PropTypes.object,
  contextId: PropTypes.string,
  showSeparator: PropTypes.bool,
};

export default EnhancedHeader;
