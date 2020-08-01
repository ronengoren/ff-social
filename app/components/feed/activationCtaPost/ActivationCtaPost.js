import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {
  View,
  CallToActionArea,
  IconButton,
  Text,
  DashedBorder,
} from '../../basicComponents';
import {get} from '../../../infra/utils';
import {navigationService} from '../../../infra/navigation';
// import { ActivationPostSeeMoreFooter } from '/components/activation';
// import { addHiddenPost } from '/redux/auth/actions';
import {
  postTypes,
  screenNames,
  editModes,
  originTypes,
  activationTypes,
  activationSubTypes,
  postSubTypes,
  realEstateTypes,
  entityTypes,
} from '../../../vars/enums';
import {flipFlopColors, commonStyles} from '../../../vars';
import images from '../../../assets/images';
import ItemCtaHeader from '../ItemCtaHeader';

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  feedContainer: {
    marginHorizontal: 10,
  },
  hideButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: flipFlopColors.white,
  },
  contentWrapper: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  dashedBorder: {
    marginTop: 11,
    marginBottom: 15,
  },
  textBody: {
    fontSize: 18,
    lineHeight: 24,
    paddingTop: 10,
  },
  cta: {
    minHeight: 60,
    marginVertical: 15,
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderColor: flipFlopColors.azure,
    padding: 10,
  },
  placeholderText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    color: flipFlopColors.azure,
    textAlign: 'center',
  },
  journeyContentWrapper: {
    paddingHorizontal: 15,
  },
  journeyActivationTitle: {
    height: 40,
    textAlign: 'center',
  },
  journeyTextBody: {
    fontSize: 16,
    lineHeight: 22,
  },
  journeyActivationCta: {
    height: 100,
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderColor: flipFlopColors.azure,
    paddingHorizontal: 10,
  },
  journeyPlaceholderText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    color: flipFlopColors.azure,
    textAlign: 'center',
  },
});

class ActivationCtaPost extends Component {
  render() {
    const {
      data,
      hiddenPosts,
      isFeedPost,
      style,
      originType,
      totals,
      isJourneyActivation,
    } = this.props;
    const {fields = {}, numOfSimilarAnswers, id} = data;
    const {media = {}, cta, header, body} = fields;

    if (!data || hiddenPosts[data.id]) {
      return null;
    }

    return (
      <View
        style={[
          commonStyles.shadow,
          styles.container,
          isFeedPost && styles.feedContainer,
          style,
        ]}>
        <ItemCtaHeader
          isTitleBold
          mediaUrl={media.thumbnail || media.url}
          size={
            isJourneyActivation
              ? ItemCtaHeader.sizes.SMALL
              : ItemCtaHeader.sizes.MEDIUM
          }
          mediaSource={images.common.gradientGreenWithFlipFlopLogo}
          canNavigateToProfile={false}
        />
        {!isJourneyActivation && (
          <IconButton
            isAwesomeIcon
            name="times"
            iconColor="b60"
            iconSize={16}
            onPress={this.hideActivationCta}
            style={[commonStyles.shadow, styles.hideButton]}
          />
        )}
        <View
          style={
            isJourneyActivation
              ? styles.journeyContentWrapper
              : styles.contentWrapper
          }>
          <Text
            size={isJourneyActivation ? 16 : 24}
            lineHeight={isJourneyActivation ? 20 : 25}
            color={flipFlopColors.b30}
            bold
            style={[
              commonStyles.textAlignCenter,
              isJourneyActivation && styles.journeyActivationTitle,
            ]}>
            {header}
          </Text>
          {isJourneyActivation && <DashedBorder style={styles.dashedBorder} />}
          {!isJourneyActivation && !!body && (
            <Text
              color={flipFlopColors.b30}
              style={[
                commonStyles.textAlignCenter,
                isJourneyActivation ? styles.journeyTextBody : styles.textBody,
              ]}>
              {body}
            </Text>
          )}
          <CallToActionArea
            onPress={this.navigateToActivationEditor}
            style={[
              commonStyles.smallShadow,
              isJourneyActivation ? styles.journeyActivationCta : styles.cta,
            ]}
            textStyle={[
              isJourneyActivation
                ? styles.journeyPlaceholderText
                : styles.placeholderText,
            ]}
            text={cta}
          />
        </View>
        {/* {!isJourneyActivation && <ActivationPostSeeMoreFooter totals={totals} data={data} activationId={id} count={numOfSimilarAnswers} title={header} originType={originType} />} */}
      </View>
    );
  }

  isListItemActivation =
    get(this.props, 'data.activationType') === activationTypes.LIST ||
    (get(this.props, 'data.activationType') === activationTypes.ACTION &&
      get(this.props, 'data.activationSubType') ===
        activationSubTypes.LIST_ITEM);

  hideActivationCta = () => {
    // const { addHiddenPost, data } = this.props;
    // const { id } = data;
    // const timeNow = new Date();
    // const expiration = timeNow.setDate(timeNow.getDate() + 1);
    // addHiddenPost(id, { expiration });
  };

  navigateToActivationEditor = () => {
    const {
      data,
      scrollToFeedTop,
      originType,
      screenContextType,
      screenContextId,
    } = this.props;
    const {
      fields = {},
      id: activationId,
      editorFeatures,
      activationSubType,
      activationType,
    } = data;
    const {resultHeader: title, header: headerText, cta: bodyText} = fields;
    const context =
      screenContextType && screenContextId
        ? {contextId: screenContextId, contextType: screenContextType}
        : {};

    let postSubType;
    let postType;
    let tags;

    switch (activationSubType) {
      case activationSubTypes.RECOMMENDATION:
        postType = postTypes.RECOMMENDATION;
        break;
      case activationSubTypes.GUIDE:
        postType = postTypes.GUIDE;
        break;
      case activationSubTypes.LIST:
        postType = entityTypes.LIST;
        break;
      case activationSubTypes.BUY:
        postSubType = postSubTypes.SEEKING;
        postType = postTypes.GIVE_TAKE;
        break;
      case activationSubTypes.SELL:
        postSubType = postSubTypes.OFFERING;
        postType = postTypes.GIVE_TAKE;
        break;
      case activationSubTypes.JOB_LOOKING:
        postSubType = postSubTypes.SEEKING;
        postType = postTypes.JOB;
        break;
      case activationSubTypes.JOB_OFFERING:
        postSubType = postSubTypes.OFFERING;
        postType = postTypes.JOB;
        break;
      case activationSubTypes.REAL_ESTATE_LOOKING_RENT:
      case activationSubTypes.REAL_ESTATE_LOOKING_SUBLET:
      case activationSubTypes.REAL_ESTATE_LOOKING_ROOMMATES:
        if (activationSubType === activationSubTypes.REAL_ESTATE_LOOKING_RENT) {
          tags = [realEstateTypes.RENT];
        } else if (
          activationSubType === activationSubTypes.REAL_ESTATE_LOOKING_SUBLET
        ) {
          tags = [realEstateTypes.SUBLET];
        } else if (
          activationSubType === activationSubTypes.REAL_ESTATE_LOOKING_ROOMMATES
        ) {
          tags = [realEstateTypes.ROOMMATES];
        }

        postSubType = postSubTypes.SEEKING;
        postType = postTypes.REAL_ESTATE;
        break;
      case activationSubTypes.REAL_ESTATE_OFFERING_SUBLET:
      case activationSubTypes.REAL_ESTATE_OFFERING_ROOMMATES:
      case activationSubTypes.REAL_ESTATE_OFFERING_RENT:
        if (
          activationSubType === activationSubTypes.REAL_ESTATE_OFFERING_RENT
        ) {
          tags = [realEstateTypes.RENT];
        } else if (
          activationSubType === activationSubTypes.REAL_ESTATE_OFFERING_SUBLET
        ) {
          tags = [realEstateTypes.SUBLET];
        } else if (
          activationSubType ===
          activationSubTypes.REAL_ESTATE_OFFERING_ROOMMATES
        ) {
          tags = [realEstateTypes.ROOMMATES];
        }

        postSubType = postSubTypes.OFFERING;
        postType = postTypes.REAL_ESTATE;
        break;
      default:
        postSubType = activationType;
        postType = postTypes.ACTIVATION;
    }

    if (activationSubType === activationSubTypes.INVITE_FRIENDS) {
      const {
        user: {id},
      } = this.props;
      navigationService.navigate(screenNames.InviteFriends, {
        entityId: id,
        inviteOrigin: 'Activation CTA',
        isActivation: true,
      });
    } else if (this.isListItemActivation) {
      const {listId} = fields;
      const {id: postToHideOnSubmit, activationType, activationSubType} = data;
      this.navigateToCreateListItem({
        listId,
        postToHideOnSubmit,
        activationType,
        activationSubType,
      });
    } else {
      navigationService.navigate(screenNames.PostEditor, {
        onCreated: scrollToFeedTop,
        mode: editModes.CREATE,
        editorFeatures,
        origin: originType,
        postData: {
          tags,
          postType,
          postSubType,
          title,
          headerText,
          bodyText,
          activationId,
          activation: data,
        },
        ...context,
      });
    }
  };

  navigateToCreateListItem = ({
    listId,
    postToHideOnSubmit,
    activationType,
    activationSubType,
  }) => {
    navigationService.navigate(screenNames.AddListItem, {
      mode: editModes.CREATE,
      showModalOnSubmit: true,
      listId,
      postToHideOnSubmit,
      activationType,
      activationSubType,
    });
  };
}

ActivationCtaPost.propTypes = {
  totals: PropTypes.object,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  isFeedPost: PropTypes.bool,
  isJourneyActivation: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  data: PropTypes.object,
  hiddenPosts: PropTypes.object,
  scrollToFeedTop: PropTypes.func,
  //   addHiddenPost: PropTypes.func,
  screenContextType: PropTypes.string,
  screenContextId: PropTypes.string,
  user: PropTypes.object,
};

const mapDispatchToProps = {
  //   addHiddenPost
};

const mapStateToProps = (state) => ({
  totals: get(state, 'auth.user.nationalityGroup.totals'),
  user: get(state, 'auth.user'),
  hiddenPosts: get(state, 'auth.hiddenPosts'),
});

ActivationCtaPost = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActivationCtaPost);
export default ActivationCtaPost;
