import React from 'react';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet} from 'react-native';
import {UserRelatedEntityCard} from '../../components/entity';
import {View, Text} from '../../components/basicComponents';
import {InfiniteScroll} from '../../components';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {screenNames, screenGroupNames, groupType} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  viewAllContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    marginRight: 10,
  },
  firstItemCarouselStyle: {
    marginLeft: 15,
  },
  groupsCarouselBorder: {
    marginHorizontal: 15,
    borderBottomColor: flipFlopColors.b90,
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  userGroupsCarouselLoading: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  userGroupsEntity: {
    marginTop: 5,
    marginBottom: 20,
  },
});

const userGroupsOrFeaturedGroupsQuery = {
  domain: 'groups',
  key: 'getUserGroupsOrFeaturedGroups',
  params: {perPage: 20},
};

class UserGroupsCarousel extends React.Component {
  render() {
    const {isAnnotation, onRef, isAnnotationActive, onLayout} = this.props;

    return (
      <View onLayout={onLayout} ref={onRef}>
        <InfiniteScroll
          horizontal
          showRefreshingSpinner={false}
          ListItemComponent={this.renderGroupEntity}
          apiQuery={userGroupsOrFeaturedGroupsQuery}
          reducerStatePath="groups.homeCarousel"
          ListLoadingComponent={
            <View style={styles.userGroupsCarouselLoading}>
              {Array.from({length: 5}, (item, index) =>
                UserRelatedEntityCard.renderPlaceholder({
                  marginRight: 10,
                  index,
                  isSecondary: true,
                  style: styles.userGroupsEntity,
                }),
              )}
            </View>
          }
          extraBottomComponent={
            <UserRelatedEntityCard
              onPress={this.navigateToGroupsList}
              isSecondary
              style={styles.userGroupsEntity}>
              <View style={styles.viewAllContainer}>
                <Text
                  bold
                  color={flipFlopColors.azure}
                  numberOfLines={1}
                  style={styles.viewAllText}>
                  {I18n.t('home.groups_carousel.view_all')}
                </Text>
                <AwesomeIcon
                  weight="light"
                  name="arrow-circle-right"
                  size={20}
                  color={flipFlopColors.azure}
                />
              </View>
            </UserRelatedEntityCard>
          }
        />
        {!isAnnotation && <View style={styles.groupsCarouselBorder} />}
        {isAnnotationActive && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: flipFlopColors.white},
            ]}
          />
        )}
      </View>
    );
  }

  renderGroupEntity = ({data, index}) => {
    const {id, name, media, themeColor} = data;
    return (
      <UserRelatedEntityCard
        textProps={{size: 14, bold: true}}
        style={styles.userGroupsEntity}
        isSecondary
        firstItemStyle={styles.firstItemCarouselStyle}
        id={id}
        onPress={() =>
          this.navigateToGroup({
            entityId: id,
            data: {name, themeColor},
            groupType: groupType.GROUP,
          })
        }
        text={name}
        imageSrc={
          media.source ||
          (media.url && {uri: media.url}) ||
          (media.thumbnail && {uri: media.thumbnail})
        }
        themeColor={themeColor}
        key={id}
        index={index}
      />
    );
  };

  navigateToGroupsList = () => {
    navigationService.navigate(screenGroupNames.GROUPS_TAB, null, {
      noPush: true,
    });
  };

  navigateToGroup = (params) => {
    navigationService.navigate(screenNames.GroupView, params);
  };
}

UserGroupsCarousel.propTypes = {
  onRef: PropTypes.func,
  isAnnotation: PropTypes.bool,
  isAnnotationActive: PropTypes.bool,
  onLayout: PropTypes.func,
};

export default UserGroupsCarousel;
