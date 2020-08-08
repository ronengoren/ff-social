import LocalStorageBase from './LocalStorageBase';

class HiddenPosts extends LocalStorageBase {
  async checkAndRemoveExpired() {
    const currentTime = new Date().getTime();
    const allStorageObjects = await this.get(this.key);
    if (allStorageObjects) {
      Object.keys(allStorageObjects).forEach((key) => {
        const expirationDate = allStorageObjects[key].expiration;
        if (expirationDate && expirationDate < currentTime) {
          this.remove(key);
        }
      });
    }
  }
}

export default new HiddenPosts('hiddenPosts');
