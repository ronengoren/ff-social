import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from '../basicComponents';
// import { analytics } from '/infra/reporting';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas/common';

const UNDERLINE_HEIGHT = 3;

const styles = StyleSheet.create({
  tabsUnderline: {
    backgroundColor: flipFlopColors.b90,
    position: 'absolute',
    height: UNDERLINE_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabs: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: flipFlopColors.white,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginHorizontal: 15,
  },
  tabWithoutMargin: {
    flex: 1,
    marginHorizontal: 0,
  },
  activeTabUnderline: {
    position: 'absolute',
    height: UNDERLINE_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
  },
  redDotIndicator: {
    height: 6,
    width: 6,
    marginLeft: 10,
    marginTop: -15,
    backgroundColor: flipFlopColors.red,
    borderRadius: 50,
  },
  counterWrapper: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
    marginBottom: UNDERLINE_HEIGHT,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: flipFlopColors.white,
    fontSize: 12,
    lineHeight: 14,
  },
  actionWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 15,
    paddingBottom: 4,
  },
  separatorWrapper: {
    width: 1,
    height: '100%',
    justifyContent: 'center',
    marginBottom: UNDERLINE_HEIGHT,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: flipFlopColors.b90,
  },
  text: {
    marginBottom: UNDERLINE_HEIGHT,
  },
});

class SubHeader extends React.Component {
  render() {
    const {action, style} = this.props;
    return (
      <View style={[styles.tabs, style]}>
        <View style={styles.tabsUnderline} />
        {this.renderTabs()}
        {action && <View style={styles.actionWrapper}>{action}</View>}
      </View>
    );
  }

  renderTabs = () => {
    const {tabs, activeTab} = this.props;
    const tabComponents = [];
    tabs.forEach((tab, index) => {
      const {name, value, testID, showRedDotIndicator, counter} = tab;
      const isTabActive = activeTab === value;
      tabComponents.push(
        this.renderTab(
          name,
          value,
          testID,
          isTabActive,
          showRedDotIndicator,
          counter,
        ),
      );
      if (index < tabs.length - 1) {
        tabComponents.push(
          <View style={styles.separatorWrapper} key={`tabSeparator${name}`}>
            <View style={styles.separator} />
          </View>,
        );
      }
    });
    return tabComponents;
  };

  renderTab(name, value, testID, isTabActive, showRedDotIndicator, counter) {
    const {activeUnderlineColor, fullWidth, counterColor} = this.props;
    const textColor = isTabActive
      ? flipFlopColors.realBlack
      : flipFlopColors.b60;
    const tabStyle = [styles.tab, fullWidth && styles.tabWithoutMargin];
    return (
      <TouchableOpacity
        onPress={() => this.tabChangeWrapper({value})}
        style={tabStyle}
        key={value}
        activeOpacity={1}
        testID={testID}>
        <Text size={16} lineHeight={19} color={textColor} style={styles.text}>
          {name}
        </Text>
        {!!counter && (
          <View
            style={[styles.counterWrapper, {backgroundColor: counterColor}]}>
            <Text style={styles.counterText} bold>
              {counter}
            </Text>
          </View>
        )}
        {isTabActive && (
          <View
            style={[
              styles.activeTabUnderline,
              {backgroundColor: activeUnderlineColor},
            ]}
          />
        )}
        {showRedDotIndicator && <View style={styles.redDotIndicator} />}
      </TouchableOpacity>
    );
  }

  tabChangeWrapper = ({value}) => {
    // const { screenName, onTabChange, enableAnalytics } = this.props;
    // enableAnalytics && analytics.viewEvents.tabView({ screenName, origin: screenName, subTab: value }).dispatch();
    // onTabChange(value);
  };
}

SubHeader.defaultProps = {
  counterColor: flipFlopColors.red,
  activeUnderlineColor: flipFlopColors.green,
  enableAnalytics: false,
};

SubHeader.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      counter: PropTypes.number,
      showRedDotIndicator: PropTypes.bool,
      testID: PropTypes.string,
    }),
  ).isRequired,
  action: PropTypes.node,
  screenName: PropTypes.string,
  activeTab: PropTypes.string.isRequired,
  activeUnderlineColor: PropTypes.string,
  counterColor: PropTypes.string,
  style: stylesScheme,
  onTabChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  enableAnalytics: PropTypes.bool,
};

export default SubHeader;
