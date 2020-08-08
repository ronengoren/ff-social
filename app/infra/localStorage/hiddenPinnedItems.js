import LocalStorageBase from './LocalStorageBase';

class HiddenPinnedItems extends LocalStorageBase {
  async add(addedId) {
    let pinnedItems = (await this.get()) || [];
    const index = pinnedItems.findIndex((item) => item.id === addedId);
    if (index > -1) {
      pinnedItems = [
        ...pinnedItems.slice(0, index),
        ...pinnedItems.slice(index, pinnedItems.length),
      ];
    }
    pinnedItems.push(addedId);
    pinnedItems.slice(0, 20);
    await this.set(pinnedItems);
  }

  async has(id) {
    const pinnedItems = await this.get();
    const hasId =
      Array.isArray(pinnedItems) && pinnedItems.some((item) => item.id === id);

    return hasId;
  }
}

export default new HiddenPinnedItems('hiddenPinnedItems');
