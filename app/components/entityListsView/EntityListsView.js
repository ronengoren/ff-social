import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native';
import {connect} from 'react-redux';
import {
  InfiniteScroll,
  EntityListsViewSubheader,
  OptionsSelector,
} from '../../components';
import {View, Text} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {get} from '../../infra/utils';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  headerWrapper: {
    marginTop: 15,
  },
  headerBar: {
    paddingHorizontal: 15,
  },
  options: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    marginBottom: 15,
    marginHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
  },
  topSeparator: {
    height: 1,
    marginTop: 20,
    marginHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
  },
  createEntityButton: {
    position: 'absolute',
    top: 0,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  createEntityButtonIcon: {
    marginLeft: 6,
    lineHeight: 21,
  },
  topSectionHidden: {
    height: 0,
    overflow: 'hidden',
  },
});

class EntityListsView extends Component {
  static getSelectedOptionIndex({optionsSelectorProps}) {
    const {showOptionAll, selectedOptionIndex} = optionsSelectorProps;

    if (!showOptionAll) {
      return 0;
    }
    return selectedOptionIndex || OptionsSelector.ALL_OPTION_INDEX;
  }

  state = {
    selectedOptionIndex: EntityListsView.getSelectedOptionIndex({
      optionsSelectorProps: this.props.optionsSelectorProps,
    }),
  };

  render() {
    const {onScroll, bottomSectionListProps, listFooterComponent} = this.props;
    const {
      apiQuery,
      reducerStatePath,
      ListItemComponent,
      listItemProps,
      listEmptyState,
      listLoadingComponent,
      normalizedSchema,
    } = bottomSectionListProps;

    return (
      <View style={styles.wrapper}>
        <InfiniteScroll
          ref={(node) => {
            this.infiniteScroll = node;
          }}
          reducerStatePath={reducerStatePath}
          apiQuery={apiQuery}
          ListItemComponent={ListItemComponent}
          listItemProps={listItemProps}
          ListEmptyComponent={listEmptyState}
          ListLoadingComponent={listLoadingComponent}
          ListHeaderComponent={this.renderHeader()}
          ListFooterComponent={listFooterComponent}
          onTopFetchAction={this.reloadTopSectionList}
          normalizedSchema={normalizedSchema || 'MIXED_TYPE_ENTITIES'}
          onScroll={onScroll}
        />
      </View>
    );
  }

  static getDerivedStateFromProps(props, state) {
    const {
      optionsSelectorProps: {selectedOptionIndex},
    } = props;
    if (state.propsSelectedOptionIndex !== selectedOptionIndex) {
      return {
        selectedOptionIndex,
        propsSelectedOptionIndex: selectedOptionIndex,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {topSectionData} = this.props;
    const isNextTopSectionDataHasItems =
      topSectionData && !!topSectionData.length;
    const isPrevTopSectionDataHasItems =
      prevProps.topSectionData && !!prevProps.topSectionData.length;
    const isDataBecameFull =
      isNextTopSectionDataHasItems && !isPrevTopSectionDataHasItems;
    const isDataBecameEmpty =
      !isNextTopSectionDataHasItems && isPrevTopSectionDataHasItems;

    if (isDataBecameFull) {
      LayoutAnimation.easeInEaseOut();
    }
    if (isDataBecameEmpty) {
      LayoutAnimation.easeInEaseOut();
    }
  }

  renderHeader = () => {
    const {
      createEntityButton,
      topSectionListProps,
      bottomSectionSubHeaderProps,
      additionalHeaderComponent,
      componentColor,
      headerStyle,
      subOptionsHeaderComponent,
    } = this.props;
    return (
      <View style={[styles.headerWrapper, headerStyle]}>
        {!!createEntityButton && this.renderCreateEntityButton()}
        {additionalHeaderComponent}
        {!!topSectionListProps && this.renderTopSection()}
        {this.renderSubHeader({
          subHeaderProps: bottomSectionSubHeaderProps,
          componentColor,
          style: styles.headerBar,
        })}
        {this.renderOptions()}
        {!!subOptionsHeaderComponent && this.renderSubOptionsHeaderComponent()}
      </View>
    );
  };

  renderSubOptionsHeaderComponent = () => {
    const {subOptionsHeaderComponent} = this.props;
    return (
      <View>
        <View style={styles.topSeparator} />
        {subOptionsHeaderComponent}
      </View>
    );
  };

  renderCreateEntityButton = () => {
    const {createEntityButton, componentColor} = this.props;
    const {action, text, testID} = createEntityButton;
    return (
      <TouchableOpacity
        onPress={action}
        style={styles.createEntityButton}
        activeOpacity={1}
        testID={testID}>
        <Text size={16} lineHeight={21} color={componentColor}>
          {text}
        </Text>
        <AwesomeIcon
          name="plus-circle"
          color={componentColor}
          size={16}
          weight="solid"
          style={styles.createEntityButtonIcon}
        />
      </TouchableOpacity>
    );
  };

  renderTopSection = () => {
    const {
      topSectionData,
      topSectionSubHeaderProps,
      topSectionListProps,
      componentColor,
    } = this.props;
    const isDataExist = !!(topSectionData && topSectionData.length);
    const {
      reducerStatePath,
      apiQuery,
      EntityComponent,
      normalizedSchema,
    } = topSectionListProps;

    return (
      <View style={[!isDataExist && styles.topSectionHidden]}>
        {this.renderSubHeader({
          subHeaderProps: topSectionSubHeaderProps,
          componentColor,
          style: styles.headerBar,
        })}
        <InfiniteScroll
          reducerStatePath={reducerStatePath}
          apiQuery={apiQuery}
          ListItemComponent={EntityComponent}
          horizontal
          ref={(node) => {
            this.topSectionList = node;
          }}
          disableRefresh
          normalizedSchema={normalizedSchema || 'MIXED_TYPE_ENTITIES'}
        />
        <View style={styles.separator} />
      </View>
    );
  };

  renderSubHeader = ({subHeaderProps = {}, componentColor, style}) => {
    const {
      leftText,
      badge,
      style: propsStyle,
      rightButtonText,
      rightButtonAction,
      rightButtonIconName,
      rightButtonIconSize,
      rightButtonTestId,
      rightButtonStyle,
      rightButtonTextStyle,
      rightButtonColor,
      component,
    } = subHeaderProps;
    if (component) {
      return component;
    }
    return (
      <EntityListsViewSubheader
        leftText={leftText}
        badge={badge}
        badgeColor={componentColor}
        rightButtonText={rightButtonText}
        rightButtonAction={rightButtonAction}
        rightButtonColor={rightButtonColor || componentColor}
        rightButtonIconName={rightButtonIconName}
        rightButtonIconSize={rightButtonIconSize}
        rightButtonTestId={rightButtonTestId}
        rightButtonStyle={rightButtonStyle}
        rightButtonTextStyle={rightButtonTextStyle}
        style={[style, propsStyle]}
      />
    );
  };

  renderOptions = () => {
    const {
      optionsSelectorProps: {options, showOptionAll, optionAllCustomName},
      componentColor,
    } = this.props;
    const {selectedOptionIndex} = this.state;
    if (!options || !options.length) {
      return null;
    }
    return (
      <OptionsSelector
        optionsList={options}
        color={componentColor}
        style={styles.options}
        selectedOptionIndex={selectedOptionIndex}
        selectOption={this.selectOption}
        showOptionAll={showOptionAll}
        optionAllCustomName={optionAllCustomName}
      />
    );
  };

  selectOption = (index) => {
    const {
      optionsSelectorProps: {updateParentSelectedOption},
    } = this.props;
    const selectedOptionIndex = index;
    this.setState({selectedOptionIndex});
    updateParentSelectedOption({index: selectedOptionIndex});
  };

  reloadTopSectionList = () => {
    if (this.topSectionList) {
      this.topSectionList.fetchTop();
    }
  };

  scrollToOffset = ({offset, force}) => {
    this.infiniteScroll && this.infiniteScroll.scrollToOffset({offset, force});
  };
}

EntityListsView.defaultProps = {
  optionsSelectorProps: {},
  additionalHeaderComponent: null,
  listFooterComponent: null,
};

const subHeaderPropTypes = {
  leftText: PropTypes.string,
  badge: PropTypes.number,
  rightButtonText: PropTypes.string,
  rightButtonAction: PropTypes.func,
  rightButtonIconName: PropTypes.string,
  rightButtonIconSize: PropTypes.number,
  rightButtonTestId: PropTypes.string,
  rightButtonStyle: stylesScheme,
  rightButtonTextStyle: stylesScheme,
  rightButtonColor: PropTypes.number,
  component: PropTypes.node,
};

EntityListsView.propTypes = {
  onScroll: PropTypes.func,
  topSectionSubHeaderProps: PropTypes.shape(subHeaderPropTypes),
  bottomSectionSubHeaderProps: PropTypes.shape(subHeaderPropTypes),
  listFooterComponent: PropTypes.node,
  topSectionListProps: PropTypes.shape({
    apiQuery: PropTypes.object,
    reducerStatePath: PropTypes.string,
    EntityComponent: PropTypes.func,
    normalizedSchema: PropTypes.string,
  }),
  bottomSectionListProps: PropTypes.shape({
    apiQuery: PropTypes.object,
    reducerStatePath: PropTypes.string,
    entityComponent: PropTypes.node,
    listEmptyState: PropTypes.node,
    listLoadingComponent: PropTypes.node,
    ListItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    listItemProps: PropTypes.object,
    normalizedSchema: PropTypes.string,
  }),
  optionsSelectorProps: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.string),
    updateParentSelectedOption: PropTypes.func,
    showOptionAll: PropTypes.bool,
    selectedOptionIndex: PropTypes.number,
    optionAllCustomName: PropTypes.string,
  }),
  createEntityButton: PropTypes.shape({
    action: PropTypes.func,
    testID: PropTypes.string,
    text: PropTypes.string,
  }),
  additionalHeaderComponent: PropTypes.node,
  componentColor: PropTypes.string,
  topSectionData: PropTypes.array,
  headerStyle: stylesScheme,
  subOptionsHeaderComponent: PropTypes.node,
};

const mapStateToProps = (state, ownProps) => ({
  topSectionData:
    ownProps.topSectionListProps &&
    get(state, `${ownProps.topSectionListProps.reducerStatePath}.data`),
});

EntityListsView = connect(mapStateToProps, null, null, {forwardRef: true})(
  EntityListsView,
);
export default EntityListsView;
