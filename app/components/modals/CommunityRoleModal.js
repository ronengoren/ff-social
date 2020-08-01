import React, {useMemo} from 'react';
import {connect, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {Header} from '../../components';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
// import { closeCommunityRoleModal } from '/redux/general/actions';
import {
  View,
  NewTextButton,
  Text,
  Image,
} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {
  communityRoleTypes,
  screenNames,
  postTypes,
  rolesApplyOriginTypes,
} from '../../vars/enums';
import images from '../../assets/images';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
// import { analytics } from '/infra/reporting';

const definitionsByRole = {
  [communityRoleTypes.EXPERT]: {
    themeColor: flipFlopColors.lightIndigo,
  },
  [communityRoleTypes.INSIDER]: {
    themeColor: flipFlopColors.orange,
  },
};

function getDefinitionsByRole({type}) {
  return definitionsByRole[type] || {};
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: flipFlopColors.paleBlack,
  },
  modalInner: {
    borderRadius: 10,
    shadowColor: flipFlopColors.modalShadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
    backgroundColor: flipFlopColors.white,
  },
  headerBackground: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    position: 'absolute',
  },
  modalContent: {
    marginTop: 90,
    padding: 15,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
  },
  goToLobbyBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    width: '100%',
    marginBottom: 24,
  },
  goToLobbyBtnText: {
    marginRight: 5,
  },
  middleSectionDashedBorder: {
    marginBottom: 22,
    borderBottomColor: flipFlopColors.b95,
    borderBottomWidth: 1,
  },
  questionText: {
    marginBottom: 5,
    textAlign: 'center',
  },
  requestText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    height: 50,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  buttonText: {
    color: flipFlopColors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const CommunityRoleModal = ({
  show,
  type,
  closeCommunityRoleModal,
  expertsGoogleFormUrl,
  insidersGoogleFormUrl,
  insidersGuideId,
  badgeOriginalType,
}) => {
  const dispatch = useDispatch();
  const {themeColor} = useMemo(() => getDefinitionsByRole({type}), [type]);

  const onApplyPress = () => {
    // analytics.actionEvents.clickedOnApplyNow({ badgeType: badgeOriginalType, componentName: rolesApplyOriginTypes.POPUP }).dispatch();
    // dispatch(closeCommunityRoleModal());
    // const url = type === communityRoleTypes.EXPERT ? expertsGoogleFormUrl : insidersGoogleFormUrl;
    // navigationService.navigate(screenNames.WebView, { url });
  };

  const onGoToLobbyPress = () => {
    // analytics.actionEvents.clickedOnLearnMore({ badgeType: badgeOriginalType }).dispatch();
    // dispatch(closeCommunityRoleModal());
    // if (type === communityRoleTypes.EXPERT) {
    //   navigationService.navigate(screenNames.Pages, { type, header: <Header hasBackButton /> });
    // } else {
    //   navigationService.navigate(screenNames.PostPage, { entityId: insidersGuideId, postType: postTypes.GUIDE });
    // }
  };

  const onClickOutside = () => {
    dispatch(closeCommunityRoleModal());
  };

  const preventCloseModal = (event) => {
    event.stopPropagation();
  };

  if (!show) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={show}
      onRequestClose={() => {}}>
      <View
        style={styles.modal}
        onPress={onClickOutside}
        onStartShouldSetResponder={onClickOutside}>
        <View style={styles.modalInner}>
          <Image
            source={images.communityRoles[type].background}
            style={styles.headerBackground}
            onStartShouldSetResponder={preventCloseModal}
          />
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={preventCloseModal}>
            <Text
              color={flipFlopColors.b30}
              bold
              size={24}
              lineHeight={24}
              style={styles.title}>
              {I18n.t(`community_roles.${type}.modal.title`)}
            </Text>
            <Text
              size={16}
              color={flipFlopColors.b30}
              lineHeight={22}
              style={styles.description}>
              {I18n.t(`community_roles.${type}.modal.description`)}
            </Text>
            <TouchableOpacity
              style={styles.goToLobbyBtnWrapper}
              onPress={onGoToLobbyPress}>
              <Text
                bold
                size={16}
                color={themeColor}
                lineHeight={22}
                style={styles.goToLobbyBtnText}>
                {I18n.t(`community_roles.${type}.modal.go_to_lobby`)}
              </Text>
              <AwesomeIcon
                name="arrow-circle-right"
                size={16}
                color={themeColor}
                weight="solid"
              />
            </TouchableOpacity>
            <View style={styles.middleSectionDashedBorder} />
            <Text
              bold
              size={16}
              lineHeight={22}
              color={flipFlopColors.b30}
              style={styles.questionText}>
              {I18n.t(`community_roles.${type}.modal.question`)}
            </Text>
            <Text
              size={16}
              lineHeight={22}
              color={flipFlopColors.b70}
              style={styles.requestText}>
              {I18n.t(`community_roles.${type}.modal.request`)}
            </Text>
            <NewTextButton
              size={NewTextButton.sizes.big60Wrapper}
              customColor={themeColor}
              onPress={onApplyPress}
              width="100%"
              style={{...styles.button, shadowColor: themeColor}}
              textStyle={styles.buttonText}
              withShadow>
              {I18n.t(`community_roles.${type}.modal.apply`)}
            </NewTextButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

CommunityRoleModal.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  //   closeCommunityRoleModal: PropTypes.func,
  expertsGoogleFormUrl: PropTypes.string,
  insidersGoogleFormUrl: PropTypes.string,
  insidersGuideId: PropTypes.string,
  badgeOriginalType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  show: get(state, 'general.showCommunityRoleModal'),
  type: get(state, 'general.communityRoleModalType'),
  expertsGoogleFormUrl: get(
    state,
    'auth.user.nationalityGroup.infoReferences.expertsForm',
  ),
  insidersGoogleFormUrl: get(
    state,
    'auth.user.nationalityGroup.infoReferences.insidersForm',
  ),
  insidersGuideId: get(
    state,
    'auth.user.nationalityGroup.infoReferences.insidersGuide',
  ),
  badgeOriginalType: get(state, 'general.badgeOriginalType'),
});

export default connect(mapStateToProps)(CommunityRoleModal);
