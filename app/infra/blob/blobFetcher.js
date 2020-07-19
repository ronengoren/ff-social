import RNFetchBlob from 'rn-fetch-blob';
import {fetchTypes} from '../../vars/enums';

const fetchTypesArgs = {
  [fetchTypes.UPLOAD]: {
    progressEvent: 'uploadProgress',
    options: {interval: 50},
  }, // 50 ms
  [fetchTypes.DOWNLOAD]: {progressEvent: 'progress', options: {count: 10}}, // 10%
};

// this class must be a global singleton because ES6 class doesn't support destructors and if it will be disposed in a middle of a fetch task the app will crash
class BlobFetcher {
  constructor() {
    this.tasks = {};
  }

  wrap(filePath) {
    return RNFetchBlob.wrap(filePath);
  }

  async fetch({fetchId, fetchType, method, url, headers, body, onProgress}) {
    const task = RNFetchBlob.fetch(method, url, headers, body);
    this.tasks[fetchId] = task;
    const fetchTypeArgs = fetchTypesArgs[fetchType];
    const response = await task[
      fetchTypeArgs.progressEvent
    ](fetchTypeArgs.options, (progress, total) => onProgress(progress / total));
    // RNFetchBlob doesn't throw exception according to the response status code. this is a basic validation for 2xx.
    if (response.respInfo.status.toString()[0] !== '2') {
      throw response;
    } else {
      return response;
    }
  }

  cancel(fetchId) {
    const task = this.tasks[fetchId];
    if (task) {
      task.cancel();
    }
  }
}

export default new BlobFetcher();
