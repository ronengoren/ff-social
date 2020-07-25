import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from '../basicComponents';
import {InfiniteScroll, SubHeader, ScreenErrorBoundary} from '../../components';
import {EntitiesLoadingState} from '../../components/entity';
// import ViewCountsService from '/infra/viewCounts';
import {flipFlopColors} from '../../vars';
import {boundaryNames, originTypes} from '../../vars/enums';
import {stylesScheme} from '../../schemas/common';
import FeedItem from './FeedItem';

class FeedWithSubheader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSubTab: props.initialTabValue || props.tabs[0].value,
    };
  }

  render() {
    const {activeSubTab} = this.state;
    const {tabs} = this.props;
    const activeSubTabIndex = tabs.findIndex(
      (tab) => tab.value === activeSubTab,
    );
    const {renderWrappingComponent} = tabs[activeSubTabIndex];
    const Feed = this.renderFeed({activeSubTabIndex});

    if (renderWrappingComponent) {
      return renderWrappingComponent({children: Feed});
    }

    return Feed;
  }

  renderFeed({activeSubTabIndex}) {
    const {
      tabs,
      boundaryName,
      screenContextType,
      screenContextId,
      scrollToFeedTop,
      ListHeaderComponent,
      originType,
      hiddenPinnedPosts,
      ...restProps
    } = this.props;

    const feedTabOptions = {
      ListItemComponent: FeedItem,
      listItemProps: {
        screenContextType,
        screenContextId,
        scrollToFeedTop,
        refreshFeed: this.refreshFeed,
        originType,
      },
      ListLoadingComponent: <EntitiesLoadingState />,
    };

    const extendedTabs = [
      Object.assign({}, feedTabOptions, tabs[0]),
      ...tabs.slice(1),
    ];
    const keyExtractor =
      tabs[activeSubTabIndex].keyExtractor || this.defaultKeyExtractor;
    const {normalizedSchema} = tabs[activeSubTabIndex];

    return (
      <ScreenErrorBoundary boundaryName={boundaryNames.FEED}>
        <InfiniteScroll
          ref={(node) => {
            this.infiniteScroll = node;
          }}
          ListItemComponent={extendedTabs[activeSubTabIndex].ListItemComponent}
          listItemProps={extendedTabs[activeSubTabIndex].listItemProps}
          apiQuery={extendedTabs[activeSubTabIndex].apiQuery}
          reducerStatePath={extendedTabs[activeSubTabIndex].reducerStatePath}
          keyExtractor={keyExtractor}
          ListLoadingComponent={<EntitiesLoadingState />}
          ListEmptyComponent={
            extendedTabs[activeSubTabIndex].ListEmptyComponent
          }
          ListHeaderComponent={this.getListHeaderComponent()}
          ListFooterComponent={
            extendedTabs[activeSubTabIndex].ListFooterComponent
          }
          normalizedSchema={normalizedSchema}
          extraData={hiddenPinnedPosts}
          //   viewabilityConfig={ViewCountsService.postViewabilityConfig}
          //   onViewableItemsChanged={ViewCountsService.handleFeedViewableItemsChange}
          {...restProps}
        />
      </ScreenErrorBoundary>
    );
  }

  getListHeaderComponent() {
    const {activeSubTab} = this.state;
    const {
      ListHeaderComponent,
      tabs,
      fullWidth,
      activeUnderlineColor,
      subheaderStyle,
    } = this.props;

    return (
      <View>
        {ListHeaderComponent}
        <SubHeader
          tabs={tabs}
          activeTab={activeSubTab}
          onTabChange={(val) => this.setState({activeSubTab: val})}
          fullWidth={fullWidth}
          activeUnderlineColor={activeUnderlineColor}
          style={subheaderStyle}
        />
      </View>
    );
  }

  refreshFeed = () => {
    this.infiniteScroll.fetchTop();
  };

  defaultKeyExtractor = (i, index) => {
    const key = i.id || i;
    return index === 0 && typeof key === 'string'
      ? `possiblyPinned-${key}`
      : key;
  };
}

FeedWithSubheader.defaultProps = {
  activeUnderlineColor: flipFlopColors.green,
};

FeedWithSubheader.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
      apiQuery: PropTypes.object,
      reducerStatePath: PropTypes.string,
      ListItemComponent: PropTypes.func,
      listItemProps: PropTypes.object,
      keyExtractor: PropTypes.func,
      ListLoadingComponent: PropTypes.node,
      ListEmptyComponent: PropTypes.node,
      renderWrappingComponent: PropTypes.func,
      normalizedSchema: PropTypes.string,
    }),
  ),
  ListHeaderComponent: PropTypes.node,
  boundaryName: PropTypes.string,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  componentRef: PropTypes.func,
  screenContextType: PropTypes.string,
  screenContextId: PropTypes.string,
  scrollToFeedTop: PropTypes.func,
  fullWidth: PropTypes.bool,
  activeUnderlineColor: PropTypes.string,
  subheaderStyle: stylesScheme,
  initialTabValue: PropTypes.string,
  hiddenPinnedPosts: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  hiddenPinnedPosts: state.auth.hiddenPinnedPosts,
});
export default connect(mapStateToProps)(FeedWithSubheader);
