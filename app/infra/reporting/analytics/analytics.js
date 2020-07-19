import {facebookProvider, statsProvider} from '../providers';
import {LifecycleEvents, ActionEvents, ViewEvents} from './events';
import * as providersInterfaces from './providersInterfaces';

class Analytics {
  constructor(config) {
    this._config = config;
  }

  _dispatchLifecycleEvent = ({name, params}) =>
    this._dispatchEvent({type: 'lifecycleEvents', name, params});

  _dispatchActionEvent = ({name, params}) =>
    this._dispatchEvent({type: 'actionEvents', name, params});

  _dispatchViewEvent = ({name, params}) =>
    this._dispatchEvent({type: 'viewEvents', name, params});

  _dispatchEvent = ({type, name, params}) => {
    const {interfaces} = this._config;
    Object.keys(interfaces)
      .filter((providerName) => interfaces[providerName])
      .forEach((providerName) => {
        if (interfaces[providerName][type]) {
          const handler = interfaces[providerName][type][name];
          handler && handler(params);
        }
      });
  };

  lifecycleEvents = new LifecycleEvents(this._dispatchLifecycleEvent);

  actionEvents = new ActionEvents(this._dispatchActionEvent);

  viewEvents = new ViewEvents(this._dispatchViewEvent);
}

export default new Analytics({
  interfaces: {
    // mixpanel: !mixpanelProvider
    //   ? null
    //   : {
    //       lifecycleEvents: new providersInterfaces.MixpanelLifecycleEventsInterface(
    //         mixpanelProvider,
    //       ),
    //       actionEvents: new providersInterfaces.MixpanelActionEventsInterface(
    //         mixpanelProvider,
    //       ),
    //       viewEvents: new providersInterfaces.MixpanelViewEventsInterface(
    //         mixpanelProvider,
    //       ),
    //     },
    // fabric: {
    //   lifecycleEvents: new providersInterfaces.FabricLifecycleEventsInterface(
    //     fabricProvider,
    //   ),
    //   actionEvents: new providersInterfaces.FabricActionEventsInterface(
    //     fabricProvider,
    //   ),
    //   viewEvents: new providersInterfaces.FabricViewEventsInterface(
    //     fabricProvider,
    //   ),
    // },
    facebook: {
      actionEvents: new providersInterfaces.FacebookActionEventsInterface(
        facebookProvider,
      ),
    },
    // branch: {
    //   actionEvents: new providersInterfaces.BranchActionEventsInterface(
    //     branchProvider,
    //   ),
    // },
    stats: {
      viewEvents: new providersInterfaces.StatsViewEventsInterface(
        statsProvider,
      ),
    },
  },
});
