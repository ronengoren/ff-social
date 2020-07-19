// To see all the requests in the chrome Dev tools in the network tab.
XMLHttpRequest = GLOBAL.originalXMLHttpRequest // eslint-disable-line no-undef
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;
