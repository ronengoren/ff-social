import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../../../infra/localization';
import {View} from '../../../../components/basicComponents';
import {
  postTypes,
  entityTypes,
  groupPrivacyType,
  dateAndTimeFormats,
  uiColorDefinitions,
} from '../../../../vars/enums';
import {flipFlopColors} from '../../../../vars';
import {getFormattedDateAndTime} from '../../../../infra/utils/dateTimeUtils';
import {listScheme} from '../../../../schemas';
import EntityPreview from './EntityPreview';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    backgroundColor: flipFlopColors.disabledGrey,
    marginHorizontal: 15,
  },
});

class SharedPostPreview extends Component {
  render() {
    const {sharedEntity, sharedEntityType} = this.props;
    let title;
    let subtitle;
    let detailsText;
    let imageUrl;
    let videoPreview;
    let name;
    let themeColor;
    let mentions;
    let longSubtitle;

    switch (sharedEntityType) {
      case entityTypes.POST: {
        const {payload, actor} = sharedEntity;
        const {link, media, page} = payload;
        ({mentions} = sharedEntity);

        if (link && !page) {
          ({title} = link.info);
          subtitle = link.info.description;
          imageUrl = link.info.image;
          detailsText = link.host;
        } else {
          title = I18n.t(`postTypes.titles.${payload.postType}`);
          subtitle = payload.text;
          detailsText = actor.name;

          if (media && media.type === 'image' && media.url) {
            imageUrl = media.url;
          } else if (media && media.type === 'video' && media.thumbnail) {
            imageUrl = media.thumbnail;
            videoPreview = true;
          } else if (payload.postType === postTypes.STATUS_UPDATE) {
            imageUrl = actor.media.thumbnail;
            ({name, themeColor} = actor);
          } else {
            themeColor = uiColorDefinitions[payload.postType];
          }
        }
        break;
      }
      case entityTypes.PAGE: {
        const {name, about, media} = sharedEntity;

        title = name;
        subtitle = about;
        imageUrl = media.thumbnail;
        longSubtitle = true;
        break;
      }
      case entityTypes.GROUP: {
        const {
          name,
          description,
          membersCount,
          privacyType,
          media,
        } = sharedEntity;

        title = name;
        imageUrl = media.thumbnail;
        longSubtitle = true;
        if (description && description.length) {
          subtitle = description;
        } else {
          const groupTypeText =
            privacyType === groupPrivacyType.PUBLIC
              ? I18n.t('post_editor.preview_section.shared.public_group')
              : I18n.t('post_editor.preview_section.shared.private_group');
          const groupMembersText = I18n.p(
            membersCount,
            'post_editor.preview_section.shared.group_members',
          );
          subtitle = `${groupTypeText} \u00b7 ${groupMembersText}`;
        }
        break;
      }
      case entityTypes.EVENT: {
        const {name, startTime, address, media} = sharedEntity;
        title = name;
        subtitle = getFormattedDateAndTime(
          startTime,
          dateAndTimeFormats.dateTime,
        );
        detailsText = address ? address.fullAddress : null;
        imageUrl = media.thumbnail;
        break;
      }
      case entityTypes.LIST: {
        const {name, creator, media} = this.props.sharedList;
        title = name;
        detailsText = I18n.t('post_editor.preview_section.shared.list', {
          name: creator.name,
        });
        imageUrl = media.thumbnail;
        break;
      }
      default:
        return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.separator} />
        <EntityPreview
          title={title}
          subtitle={subtitle}
          longSubtitle={longSubtitle}
          subtitleMentions={mentions}
          detailsText={detailsText}
          imageUrl={imageUrl}
          videoPreview={videoPreview}
          name={name}
          themeColor={themeColor}
        />
      </View>
    );
  }
}

SharedPostPreview.propTypes = {
  sharedEntityType: PropTypes.string,
  sharedEntity: PropTypes.object,
  sharedList: listScheme,
};

const mapStateToProps = (state, ownProps) => {
  if (ownProps.sharedEntityType === entityTypes.LIST) {
    return {
      sharedList: state.lists.byId[ownProps.sharedEntity.id],
    };
  }

  return {};
};

SharedPostPreview = connect(mapStateToProps)(SharedPostPreview);
export default SharedPostPreview;
