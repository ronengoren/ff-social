import React, {Component} from 'react';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { apiQuery } from '/redux/apiQuery/actions';
import {StyleSheet} from 'react-native';
import {View, Text, ScrollView} from '../../components/basicComponents';
import UserRelatedEntityCard from '../../components/entity/UserRelatedEntityCard';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  loadingState: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  entitiesCarousel: {
    marginTop: 15,
    marginBottom: 25,
  },
});

class EntitiesCarousel extends Component {
  state = {
    data: this.props.data,
  };

  static renderLoadingState = ({isSecondary, style}) => (
    <View style={styles.loadingState}>
      {Array.from({length: 5}, (item, index) =>
        UserRelatedEntityCard.renderPlaceholder({
          marginRight: 10,
          index,
          isSecondary,
          style,
        }),
      )}
    </View>
  );

  render() {
    const {data} = this.state;
    const {onAllPress, style, showHeader, isSecondary} = this.props;

    return (
      <View style={style}>
        {showHeader && (
          <View style={styles.header}>
            {this.renderTitle()}
            {!!onAllPress && this.renderAllButton()}
          </View>
        )}
        {data
          ? this.renderList()
          : EntitiesCarousel.renderLoadingState({isSecondary, style})}
      </View>
    );
  }

  componentDidMount() {
    const {query} = this.props;
    query && this.getData();
  }

  renderTitle() {
    const {count, title} = this.props;
    const countText = count ? ` · ${count}` : '';

    return (
      <Text
        bold
        size={16}
        lineHeight={22}
        color={flipFlopColors.b30}>{`${title}${countText}`}</Text>
    );
  }

  renderAllButton() {
    const {onAllPress} = this.props;

    return (
      <Text
        size={16}
        lineHeight={22}
        color={flipFlopColors.azure}
        onPress={onAllPress}>
        {I18n.t('profile.view.carousels_all_btn')}
      </Text>
    );
  }

  renderList() {
    const {data} = this.state;
    const {
      onItemPress,
      isUserEntity,
      isSecondary,
      firstItemStyle,
      showItemBadge,
    } = this.props;

    return (
      <ScrollView horizontal>
        {data.map(({id, name, media, themeColor}, index) => (
          <UserRelatedEntityCard
            style={styles.entitiesCarousel}
            isSecondary={isSecondary}
            firstItemStyle={firstItemStyle}
            showItemBadge={showItemBadge && showItemBadge(data[index])}
            id={id}
            onPress={onItemPress}
            text={name}
            imageSrc={
              media.source ||
              (media.url && {uri: media.url}) ||
              (media.thumbnail && {uri: media.thumbnail})
            }
            themeColor={themeColor}
            key={id}
            index={index}
            isUserEntity={isUserEntity}
          />
        ))}
      </ScrollView>
    );
  }

  async getData() {
    // const { apiQuery, query } = this.props;
    // const response = await apiQuery({ query });
    // this.setState({ data: response.data.data });
  }
}

EntitiesCarousel.defaultProps = {
  showHeader: true,
  isSecondary: false,
};

EntitiesCarousel.propTypes = {
  firstItemStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  count: PropTypes.number,
  title: PropTypes.string,
  onAllPress: PropTypes.func,
  onItemPress: PropTypes.func,
  query: PropTypes.object,
  data: PropTypes.array,
  isUserEntity: PropTypes.bool,
  isSecondary: PropTypes.bool,
  showHeader: PropTypes.bool,
  showItemBadge: PropTypes.func,
  //   apiQuery: PropTypes.func
};

export default connect(null)(EntitiesCarousel);
