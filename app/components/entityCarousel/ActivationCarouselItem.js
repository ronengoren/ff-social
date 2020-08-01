import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '/infra/localization';
import {View, Text, DashedBorder} from '../basicComponents';
import {ItemCtaHeader} from '../../components/feed';
import {
  ThanksCounter,
  CommentsCounter,
  ViewsCounter,
  PostContent,
} from '../../components/posts';
import images from '../../assets/images';
import {flipFlopColors, commonStyles} from '../../vars';
import {screenNames, postTypes} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
    height: 310,
    borderRadius: 15,
    backgroundColor: flipFlopColors.white,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 30,
  },
  firstItem: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    marginHorizontal: 15,
  },
  activationTitle: {
    height: 40,
    textAlign: 'center',
  },
  dashedBorder: {
    marginTop: 11,
    marginBottom: 7,
  },
  activationFooter: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  commentsCounter: {
    paddingLeft: 0,
  },
});

class ActivationCarouselItem extends Component {
  render = () => {
    const {data, onPress, itemNumber} = this.props;
    const {actor, mentions = [], payload = {}, id} = data;
    const {title, text, mediaGallery} = payload;
    const mediaUrl =
      get(mediaGallery, '0.thumbnail') || get(mediaGallery, '0.url');

    if (!title || !data) {
      return null;
    }

    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View
          style={[
            commonStyles.shadow,
            styles.wrapper,
            itemNumber === 0 && styles.firstItem,
          ]}>
          <ItemCtaHeader
            canNavigateToProfile={false}
            mediaUrl={mediaUrl}
            user={actor}
            mediaSource={images.common.gradientGreenWithFlipFlopLogo}
            size={ItemCtaHeader.sizes.SMALL}
          />
          <View style={styles.content}>
            <Text
              bold
              size={16}
              lineHeight={20}
              color={flipFlopColors.b30}
              style={styles.activationTitle}>
              {title}
            </Text>
            <DashedBorder style={styles.dashedBorder} />
            {PostContent.renderPostText({
              id,
              text,
              mentions,
              contentType: postTypes.ACTIVATION,
              isPostPage: false,
              numberOfLines: 3,
              onPress,
            })}
            <View style={StyleSheet.absoluteFill} />
          </View>
          {this.renderFooter()}
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const {data, onPress} = this.props;
    const {comments, likes, views, id} = data;
    return (
      <View style={styles.activationFooter}>
        <CommentsCounter
          comments={comments}
          onPress={() => onPress({showKeyboard: true})}
          style={styles.commentsCounter}
        />
        <ThanksCounter
          likes={likes}
          onPress={this.handleThanksPress({id, likes})}
          imageSrc={images.emoji.thanks}
        />
        {views >= 5 && <ViewsCounter views={views} />}
      </View>
    );
  };

  handleThanksPress = ({id, likes}) => () => {
    const query = {domain: 'posts', key: 'thankedBy', params: {postId: id}};
    const reducerStatePath = `postPage.${id}/thankedBy`;
    const title = I18n.t(`entity_lists.thankers`, {likes});
    navigationService.navigate(screenNames.EntitiesList, {
      query,
      reducerStatePath,
      title,
    });
  };
}

ActivationCarouselItem.propTypes = {
  data: PropTypes.object,
  onPress: PropTypes.func,
  itemNumber: PropTypes.number,
};

export default ActivationCarouselItem;
