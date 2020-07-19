import config from '/config';
import jsClient from './jsClient';

const { token } = config.providers.logentries;
jsClient.init({ token });

module.exports = jsClient;
