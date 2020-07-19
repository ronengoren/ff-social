/* eslint-disable quote-props */

class ViewEvents {
  constructor(provider) {
    this.provider = provider;
  }

  screenView = ({ screenName, origin, originType, extraData = {} }) => {
    this.provider.trackWithProperties('Screen View', {
      'Screen Name': screenName,
      Origin: origin,
      'Origin Type': originType,
      ...extraData
    });
  };

  entityView = ({ screenName, origin, entityId, entityName, originType, extraData = {} }) => {
    this.provider.trackWithProperties('Screen View', {
      'Screen Name': screenName,
      Origin: origin,
      'Entity Id': entityId,
      'Entity Name': entityName,
      'Origin Type': originType,
      ...extraData
    });
  };

  tabView = ({ screenName, origin, subTab, extraData = {} }) => {
    this.provider.trackWithProperties('Screen View', {
      'Screen Name': screenName,
      Origin: origin,
      'Sub Tab': subTab,
      ...extraData
    });
  };

  annotationView = ({ screenName, origin, annotationType }) => {
    this.provider.trackWithProperties('Annotation View', {
      'Screen Name': screenName,
      Origin: origin,
      'Annotation Type': annotationType
    });
  };

  countryReverse = ({ originCountryName, destinationCountryName }) => {
    this.provider.trackWithProperties('Country Reverse', { 'Origin Country Name': originCountryName, 'Destination Country Name': destinationCountryName });
  };
}

export default ViewEvents;
