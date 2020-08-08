import {merge} from 'lodash';
import {isDevEnv} from './vars/environment';
import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

// TODO: inject providers keys from env/build
const GCM_SENDER_ID = '491095378161';

const firebaseConfig = {
  apiKey: 'AIzaSyDN-hwrv7_A-yVPUTsrdcYPvjfExorSHPk',
  authDomain: 'yff-social.firebaseapp.com',
  databaseURL: 'https://ff-social.firebaseio.com',
  projectId: 'ff-social',
  storageBucket: 'gs://ff-social.appspot.com',
  messagingSenderId: '491095378161',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const sharedConfig = {
  providers: {
    googlePlacesAPI: {
      url: 'https://maps.googleapis.com/maps/api/place',
      apiKey: 'AIzaSyCfbpQ1VGeiEoD6LBDiOV5fbQy8Yt-yKVg',
    },
    googleTranslateAPI: {
      url: 'https://translation.googleapis.com/language/translate/v2',
      apiKey: '',
    },
  },
};

const devConfig = {
  api: {
    url: 'https://ff-social.firebaseio.com',
    timeout: 60000,
  },
  web: {
    url: '',
  },
  healthCheckUrl: '',
  providers: {
    // pushwoosh: {
    //   appId: '68ABE-20932',
    //   projectNumber: GCM_SENDER_ID,
    // },
    stream: {
      apiKey: '',
    },
    logentries: {
      token: '',
    },
    mixpanel: {
      token: '',
      fireEvents: false,
    },
    algolia: {
      appId: '',
      apiKey: '',
      indexPrefix: 'dev_',
    },
    testfairy: {
      recordSessions: false,
      token: '',
    },
    stats: {
      url: '',
    },
    instagram: {
      clientId: '',
      basicUrl: '',
      graphUrl: '',
      redirectUrl: '',
      scope: ['user_profile', 'user_media'],
    },
  },
};

const prodConfig = {
  api: {
    url: 'https://ff-social.firebaseio.com',
    timeout: 60000,
  },
  web: {
    url: '',
  },
  healthCheckUrl: '',
  providers: {
    pushwoosh: {
      appId: '',
      projectNumber: GCM_SENDER_ID,
    },
    stream: {
      apiKey: '',
    },
    logentries: {
      token: '',
    },
    mixpanel: {
      fireEvents: true,
      token: '',
    },
    algolia: {
      appId: '',
      apiKey: '',
      indexPrefix: 'prod_',
    },
    testfairy: {
      recordSessions: true,
      token: '',
    },
    stats: {
      url: '',
    },
    instagram: {
      clientId: '',
      basicUrl: '',
      graphUrl: '',
      redirectUrl: '',
      scope: ['user_profile', 'user_media'],
    },
  },
};

const appConfig = merge(sharedConfig, isDevEnv ? devConfig : prodConfig);

export default appConfig;
