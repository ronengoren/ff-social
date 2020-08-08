import {compact, get, omit} from '../../infra/utils';
import LocalStorageBase from './LocalStorageBase';

class Medias extends LocalStorageBase {
  init() {
    this.invalidateInstagramGalleries();
  }

  async invalidateInstagramGalleries() {
    const instagramGalleries = await this.getInstagramGalleries();
    const updatedInstagramGalleries = {...instagramGalleries};
    const promises = Object.keys(instagramGalleries).map(async (token) => {
      const isGalleryInvalidated = await this.shouldRevokeGallery(token);
      return isGalleryInvalidated && token;
    });

    const galleriesToRevoke = compact(await Promise.all(promises));

    galleriesToRevoke.forEach((token) => {
      delete updatedInstagramGalleries[token];
    });

    if (galleriesToRevoke.length) {
      await this.update({instagram: updatedInstagramGalleries});
    }
  }

  async getInstagramGalleries() {
    const galleries = await this.get();
    const instagramGalleries = get(galleries, 'instagram');
    if (!instagramGalleries) {
      await this.update({instagram: {}});
      return {};
    }

    return (await this.get()).instagram;
  }

  async shouldRevokeGallery(token) {
    const cachedGalleryByToken = get(await this.getInstagramGalleries(), token);
    const now = new Date();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const lastUpdateDate = new Date(cachedGalleryByToken.lastUpdate);
    return now.getTime() - lastUpdateDate.getTime() > ONE_DAY;
  }

  async addInstagramGalleryToCache({token, gallery}) {
    const instagramGalleryCached = await this.getInstagramGalleries();
    const updatedObject = {
      instagram: {
        ...instagramGalleryCached,
        [token]: {gallery, lastUpdate: new Date()},
      },
    };
    await this.update(updatedObject);
  }

  async removeInstagramGalleryFromCache(token) {
    const instagramGalleryCached = await this.getInstagramGalleries();
    await this.update({instagram: omit(instagramGalleryCached, token)});
  }
}

export default new Medias('medias');
