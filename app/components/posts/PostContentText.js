import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import I18n from '../../infra/localization';
// import { HtmlTextWithLinks } from '/components';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {
  postTypes,
  screenNamesByEntityType,
  screenNames,
  entityTypes,
} from '../../vars/enums';
import {mentionsSchema} from '../../schemas/common';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: flipFlopColors.white,
    paddingTop: 5,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  marginBottom: {
    marginBottom: 8,
  },
});

class PostContentText extends React.Component {
  render() {
    const {
      text,
      mentions,
      isPostPage,
      isWithMarginBottom,
      numberOfLines,
    } = this.props;

    const action = this.createPressAction();

    return (
      <View style={[styles.wrapper, isWithMarginBottom && styles.marginBottom]}>
        {/* <HtmlTextWithLinks
          text={text}
          ctaText={I18n.t('posts.cta_button')}
          showFullText={isPostPage}
          selectable
          mentions={mentions}
          textStyle={styles.text}
          lineHeight={Platform.select({ ios: 22, android: 20 })}
          numberOfLines={numberOfLines}
          onPress={action}
        /> */}
      </View>
    );
  }

  createPressAction = () => {
    const {id, contentType, context, isPostPage, onPress} = this.props;
    if (onPress) {
      return onPress;
    } else if (contentType === postTypes.GUIDE && !isPostPage) {
      return () =>
        navigationService.navigate(screenNames.PostPage, {entityId: id});
    } else if (screenNamesByEntityType[contentType]) {
      if (contentType === entityTypes.LIST_ITEM) {
        return () =>
          navigationService.navigate(screenNamesByEntityType[contentType], {
            entityId: id,
            listId: context.id,
          });
      }
      return () =>
        navigationService.navigate(screenNamesByEntityType[contentType], {
          entityId: id,
        });
    }
    return null;
  };
}

PostContentText.defaultProps = {
  numberOfLines: 4,
};

PostContentText.propTypes = {
  id: PropTypes.string,
  numberOfLines: PropTypes.number,
  text: PropTypes.string,
  mentions: mentionsSchema,
  context: PropTypes.object,
  isWithMarginBottom: PropTypes.bool,
  contentType: PropTypes.string,
  isPostPage: PropTypes.bool,
  onPress: PropTypes.func,
};

export default PostContentText;
