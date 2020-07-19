function ViewEvent(name, params) {
  this.name = name;
  this.params = params;
}

class ViewEvents {
  constructor(dispatcher) {
    ViewEvent.prototype.dispatch = function() {
      dispatcher({ name: this.name, params: this.params });
    };
  }

  screenView = ({ screenName, origin, originType, extraData }) => new ViewEvent('screenView', { screenName, origin, originType, extraData });

  entityView = ({ screenName, origin, entityId, entityName, originType, extraData }) =>
    new ViewEvent('entityView', { screenName, origin, entityId, entityName, originType, extraData });

  tabView = ({ screenName, origin, subTab, extraData }) => new ViewEvent('tabView', { screenName, origin, subTab, extraData });

  postsViews = ({ posts }) => new ViewEvent('postsViews', { posts });

  annotationView = ({ screenName, origin, annotationType }) => new ViewEvent('annotationView', { screenName, origin, annotationType });

  countryReverse = ({ originCountryName, destinationCountryName }) => new ViewEvent('countryReverse', { originCountryName, destinationCountryName });
}

export default ViewEvents;
