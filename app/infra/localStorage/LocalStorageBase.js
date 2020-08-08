import AsyncStorage from '@react-native-community/async-storage';
// import { Logger } from '/infra/reporting';

class LocalStorageBase {
  constructor(key) {
    this.key = key;
  }

  set(object) {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(this.key, JSON.stringify(object), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.key, (err, val) => {
        if (err) {
          console.error({
            message: 'AsyncStorage failed to get item',
            key: this.key,
            err,
          });
          reject(err);
        } else {
          resolve(JSON.parse(val));
        }
      });
    });
  }

  async update(changes) {
    let object = await this.get();
    object = object || {};
    const updatedObject = {...object, ...changes};
    this.set(updatedObject);
  }

  remove() {
    return AsyncStorage.removeItem(this.key);
  }
}

export default LocalStorageBase;
