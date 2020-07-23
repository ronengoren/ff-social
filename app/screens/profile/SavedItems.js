import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {MY_HOOD} from '../../components/themes';
import images from '../../assets/images';
import {screenNames, originTypes} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import EntitiesCarousel from './EntitiesCarousel';

const extraTotalsData = {
  myhood: {
    id: 'myhood',
    name: 'My Hood',
    media: {
      source: images.profile.hood,
    },
  },
  other: {
    id: 'other',
    name: 'Other',
    media: {
      source: images.profile.other,
    },
  },
};

class SavedItems extends Component {
  render() {
    const {totals, topics, firstItemStyle} = this.props;
    const title = I18n.t('profile.view.saved_items_title');
    // const data = [];
    // totals.forEach((total) => {
    //   const topic =
    //     topics.find((topic) => topic.tags.includes(total.tag)) ||
    //     extraTotalsData[total.tag];
    //   if (topic) {
    //     const item = {name: topic.name, media: topic.media, id: total.tag};
    //     data.push(item);
    //   }
    // });

    // if (!data.length) {
    //   return null;
    // }

    return (
      <EntitiesCarousel
        firstItemStyle={firstItemStyle}
        title={title}
        // data={data}
        // onItemPress={this.handleItemPress}
      />
    );
  }

  handleItemPress = ({entityId}) => {
    //   const {
    //     profileUser: {id, name},
    //     appUser,
    //   } = this.props;
    //   const isMyProfile = id === appUser.id;
    //   if (isMyProfile) {
    //     if (entityId === MY_HOOD) {
    //       navigationService.navigate(screenNames.MyNeighborhoodView, {
    //         isShowSaved: true,
    //       });
    //     } else {
    //       navigationService.navigate(screenNames.MyThemeView, {
    //         theme: entityId,
    //         originType: originTypes.MY_PROFILE,
    //         isShowSaved: true,
    //       });
    //     }
    //   } else {
    //     navigationService.navigate(screenNames.OthersThemeView, {
    //       userId: id,
    //       userName: name,
    //       theme: entityId,
    //       originType: originTypes.USER_PROFILE,
    //     });
    //   }
  };
}

SavedItems.propTypes = {
  firstItemStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  // totals: PropTypes.array,
  topics: PropTypes.array,
  profileUser: PropTypes.object,
  appUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  topics: get(state.auth, 'appSettings.data.topics', []),
});

export default connect(mapStateToProps)(SavedItems);
