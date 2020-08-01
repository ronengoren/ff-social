import {Share, Platform} from 'react-native';
import {
  getHomeisWebLink,
  mailto,
  sendSMSLink,
  sendWhatsappLink,
  sendFacebookLink,
  setClipboardHomeisWebLink,
} from '../../infra/utils/linkingUtils';
import I18n from '../../infra/localization';
import {flipFlopColors} from '../../vars';
import {shareTypes} from '../../vars/enums';
// import { analytics } from '/infra/reporting';
import {isRTL} from '../../infra/utils/stringUtils';

const openNativeShare = ({entityId, entityType, urlSlug}) => {
  const entityUrl = getHomeisWebLink({urlSlug, entityType, entityId});
  Share.share(
    {
      ...Platform.select({
        ios: {
          message: entityUrl,
          url: entityUrl,
        },
        android: {
          message: entityUrl,
        },
      }),
      title: '',
    },
    {
      ...Platform.select({
        ios: {},
        android: {
          dialogTitle: `Share : `,
        },
      }),
    },
  );
};

export const shareExternallyActionDefinition = ({
  entityId,
  entityType,
  urlSlug,
}) => ({
  id: 'shareExternally',
  text: I18n.t('common.share.share_externally'),
  iconSize: 16,
  awesomeIconName: 'share-alt',
  shouldClose: true,
  action: () =>
    setTimeout(() => {
      openNativeShare({entityId, entityType, urlSlug});
    }, 500),
});

const shareActionSheetDefinition = ({
  navigateToPostEditor,
  entityId,
  entityType,
  actorId,
  actorName,
  entityName,
  creatorName,
  creatorId,
  themes,
  screenCollection,
  componentName,
  urlSlug,
}) => {
  const webLink = getHomeisWebLink({entityId, entityType, urlSlug});
  const analyticsShareActionEvent = (option) => {
    // const dataToSend = {
    //   actorId,
    //   actorName,
    //   entityType,
    //   entityId,
    //   entityName,
    //   creatorName,
    //   creatorId,
    //   themes,
    //   screenCollection,
    //   componentName,
    //   shareType: option,
    //   urlSlug
    // };
    // analytics.actionEvents.shareAction(dataToSend).dispatch();
  };

  const options = [
    {
      id: shareTypes.WHATSAPP,
      text: I18n.t('common.share.whatsApp'),
      awesomeIconName: 'whatsapp',
      awesomeIconWeight: 'brands',
      iconSize: 16,
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.WHATSAPP);
        setTimeout(() => sendWhatsappLink(webLink), 500);
      },
      textStyle: {marginTop: isRTL(I18n.t('common.share.whatsApp')) ? 2 : 0},
      iconWrapperStyle: {borderColor: '#25d366'},
      iconStyle: {color: '#25d366'},
    },
    {
      id: shareTypes.EMAIL,
      text: I18n.t('common.share.email'),
      iconSize: 15,
      awesomeIconName: 'envelope',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.EMAIL);
        mailto('', null, webLink);
      },
      iconWrapperStyle: {borderColor: '#e91e63'},
      textStyle: {marginTop: isRTL(I18n.t('common.share.email')) ? 2 : 0},
      iconStyle: {color: '#e91e63'},
    },
    {
      id: shareTypes.LINK,
      text: I18n.t('common.share.link'),
      iconSize: 14,
      awesomeIconName: 'link',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.LINK);
        setClipboardHomeisWebLink({entityId, entityType, urlSlug});
      },
      iconWrapperStyle: {borderColor: '#ffc107'},
      iconStyle: {color: '#ffc107'},
    },
    {
      id: shareTypes.SMS,
      text: I18n.t('common.share.sms'),
      iconSize: 15,
      awesomeIconName: 'comments',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.SMS);
        sendSMSLink(webLink);
      },
      iconWrapperStyle: {borderColor: '#14cc79'},
      iconStyle: {color: '#14cc79'},
    },
    {
      id: shareTypes.FACEBOOK,
      text: I18n.t('common.share.facebook'),
      iconSize: 15,
      awesomeIconName: 'facebook-f',
      awesomeIconWeight: 'brands',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.FACEBOOK);
        setTimeout(() => sendFacebookLink({link: webLink}), 500);
      },
      iconWrapperStyle: {borderColor: flipFlopColors.facebookDarkBlue},
      iconStyle: {color: flipFlopColors.facebookDarkBlue},
    },
    {
      id: shareTypes.MORE,
      text: I18n.t('common.share.more'),
      iconSize: 16,
      awesomeIconName: 'ellipsis-h',
      awesomeIconWeight: 'solid',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.MORE);
        setTimeout(() => {
          openNativeShare({entityId, entityType, urlSlug});
        }, 500);
      },
      textStyle: {marginTop: isRTL(I18n.t('common.share.more')) ? 2 : 0},
      iconWrapperStyle: {borderColor: flipFlopColors.b30},
      iconStyle: {color: flipFlopColors.b30},
    },
  ];

  if (navigateToPostEditor) {
    options.unshift({
      id: shareTypes.HOMEIS,
      text: I18n.t('common.share.homeis'),
      iconSize: 20,
      iconName: 'homeis-symbol',
      shouldClose: true,
      action: () => {
        analyticsShareActionEvent(shareTypes.HOMEIS);
        navigateToPostEditor();
      },
      textStyle: {marginTop: isRTL(I18n.t('common.share.homeis')) ? 3 : 0},
      iconWrapperStyle: {borderColor: flipFlopColors.green},
      iconStyle: {color: flipFlopColors.green},
    });
  }

  return {
    options,
    hasCancelButton: true,
  };
};

export default shareActionSheetDefinition;
