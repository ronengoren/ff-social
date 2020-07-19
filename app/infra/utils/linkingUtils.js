import {ShareDialog} from 'react-native-fbsdk';
import {Linking, Platform, Clipboard} from 'react-native';
import {isObject, appendQueryParam} from '../../infra/utils';
import config from '../../../app/config';
import Logger from '../reporting/Logger';
import {getFirstReferringParams} from '../referrerInfo';

const launchURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Logger.error(`This url is no supported: ${url}`);
    }
  } catch (err) {
    if (url.includes('telprompt')) {
      // telprompt was cancelled and Linking openURL method sees this as an error
      // it is not a true error so ignore it to prevent apps crashing
      // see https://github.com/anarchicknight/react-native-communications/issues/39
    } else {
      Logger.error(`Linking.openUrl failed; url: ${url}, error: ${err}`);
    }
  }
};

const mailto = async (to = '', subject, body) => {
  let url = 'mailto:';
  url += encodeURIComponent(to);
  url = appendQueryParam(url, 'subject', subject);
  url = appendQueryParam(url, 'body', body);

  launchURL(url);
};

const call = (phoneNumber) => {
  let url = Platform.OS !== 'android' ? 'telprompt:' : 'tel:';
  url += phoneNumber;

  launchURL(url);
};

const sendWhatsappLink = (text) => {
  const encodedText = encodeURIComponent(text);
  launchURL(`whatsapp://send?text=${encodedText}`);
};

const sendSMSLink = (text) => {
  const encodedText = encodeURIComponent(text);
  const symbol = Platform.select({ios: '&', android: '?'});
  launchURL(`sms:${symbol}body=${encodedText}`);
};

const sendFacebookLink = async ({link}) => {
  const linkObject = {contentType: 'link', contentUrl: link};
  try {
    const canShow = await ShareDialog.canShow(linkObject);
    if (canShow) {
      ShareDialog.show(linkObject);
    }
  } catch (err) {
    Logger.error(`Can't share to facebook link - ${link}`);
  }
};

const isIosAndItunesLink = (link) => {
  const match =
    Platform.OS === 'ios' && !!link.match(/^https?:\/\/itunes.apple.com/);

  return match;
};

const getHomeisWebLink = ({entityId, entityType, urlSlug}) => {
  if (urlSlug) {
    return `${config.web.url}/${urlSlug}`;
  }

  Logger.error({
    message: `Entity dosent have a urlSlug attached to it`,
    entityId,
    entityType,
  });

  const {user} = global.store.getState().auth;
  if (user && user.community) {
    const {
      community: {slug},
    } = user;
    return `${config.web.url}/${slug}/${entityType.toLowerCase()}s/${entityId}`;
  }

  Logger.error({
    message: `Couldn't get entity link, using default web url as fallback`,
    entityId,
    entityType,
  });
  return config.web.url;
};

const setClipboardHomeisWebLink = ({entityId, entityType, urlSlug}) => {
  const link = getHomeisWebLink({entityId, entityType, urlSlug});
  Clipboard.setString(link);
};

const getQueryStringParams = (query) =>
  query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          const [key, value] = param.split('=');
          // eslint-disable-next-line no-param-reassign
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, ' '))
            : '';
          return params;
        }, {})
    : {};

/* eslint-disable camelcase */
const extractBranchLinkData = async () => {
  try {
    let data = {channel: 'Organic'};
    const branchLinkData = await getFirstReferringParams();
    const {data_parsed, ...restBranchData} = branchLinkData;
    if (isObject(branchLinkData)) {
      if (Object.keys(branchLinkData).length) {
        data = {
          campaign: branchLinkData['~campaign'],
          channel: branchLinkData['~channel'],
          tags: branchLinkData['~tags'],
          linkId: branchLinkData['~id'],
          thirdParty: branchLinkData.$3p,
          ...restBranchData,
          ...data_parsed,
        };
      }
    }
    return data;
  } catch (err) {
    Logger.error('failed to extract branch link data');
    return {channel: 'Unknown'};
  }
};
/* eslint-enable camelcase */

export {
  extractBranchLinkData,
  mailto,
  call,
  sendWhatsappLink,
  sendSMSLink,
  sendFacebookLink,
  isIosAndItunesLink,
  getHomeisWebLink,
  setClipboardHomeisWebLink,
  getQueryStringParams,
};
