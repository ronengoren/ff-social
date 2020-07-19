import algoliasearch from 'algoliasearch';
import config from '../../config';
import {Logger} from '../reporting';
import {entityTypes} from '../../vars/enums';

class SearchService {
  constructor() {
    const {appId, apiKey, indexPrefix} = config.providers.algolia;
    this.client = algoliasearch(appId, apiKey);
    this.index = this.client.initIndex(
      `${config.providers.algolia.indexPrefix}superset`,
    );
    this.neighborhoodsIndex = this.client.initIndex(
      `${indexPrefix}neighborhoods`,
    );
    this.communitiesIndex = this.client.initIndex(`${indexPrefix}communities`);
    this.pagesIndex = this.client.initIndex(`${indexPrefix}pages`);
    this.citiesIndex = this.client.initIndex(`${indexPrefix}cities`);
  }

  async searchCities({term, countryCode, hitsPerPage = 20}) {
    try {
      const options = {
        query: term,
        hitsPerPage,
        restrictSearchableAttributes: [
          'fullName',
          'name',
          'asciiName',
          'alternateNames',
        ],
      };

      if (countryCode) {
        options.filters = `countryCode: ${countryCode}`;
      }

      const result = await this.citiesIndex.search(options);
      return result;
    } catch (err) {
      Logger.error(`algolia cities search failed: ${err}`);
      return {};
    }
  }

  async searchNeighborhoods(term, destinationTagName) {
    try {
      const options = {
        query: term,
        filters: `destinationTagNames: ${destinationTagName}`,
      };

      const result = await this.neighborhoodsIndex.search(options);
      return result;
    } catch (err) {
      Logger.error(`algolia neighborhoods search failed: ${err}`);
      return {};
    }
  }

  async searchCommunities({query, nationalityGroupId, perPage}) {
    try {
      const options = {
        query,
      };

      if (perPage) {
        options.hitsPerPage = perPage;
      }

      if (nationalityGroupId) {
        options.filters = `nationalityGroupId: ${nationalityGroupId}`;
      }

      const result = await this.communitiesIndex.search(options);
      return result;
    } catch (err) {
      Logger.error(`algolia communities search failed: ${err}`);
      return {};
    }
  }

  async searchPages({term, communityId, nationalityGroupId}) {
    try {
      const options = {
        query: term,
        filters: `communityId: ${communityId}`,
      };

      if (nationalityGroupId) {
        options.filters += ` OR nationalityGroupId: ${nationalityGroupId}`;
      }

      const result = await this.pagesIndex.search(options);
      return result;
    } catch (err) {
      Logger.error(`algolia pages search failed: ${err}`);
      return {};
    }
  }

  async search({
    query,
    page,
    perPage,
    communityId,
    destinationTagName,
    typoTolerance,
    entityTypeFilter,
    singleEntityType,
    nationalityGroupId,
    showOnlyPostTypes,
  }) {
    const currentTimestamp = new Date().getTime();
    try {
      let filters = `(communityId: ${communityId} OR destinationTagNames: ${destinationTagName} OR contextId: ${nationalityGroupId} OR nationalityGroupId: ${nationalityGroupId})`;
      filters += ' AND NOT privacyType: "1"';
      filters += ` AND (startTime < 0 OR startTime > ${currentTimestamp} OR endTime > ${currentTimestamp})`;
      if (entityTypeFilter) {
        filters += ` AND NOT entityType: ${entityTypeFilter}`;
      }
      if (singleEntityType) {
        filters += ` AND entityType: "${singleEntityType}"`;
      }

      if (showOnlyPostTypes) {
        const allowedPostTypes = showOnlyPostTypes
          .map((postType) => `OR postType: "${postType}"`)
          .join(' ');
        filters += ` AND (NOT entityType: "${entityTypes.POST}" ${allowedPostTypes})`;
      }

      const options = {
        query,
        page,
        filters,
        typoTolerance,
      };

      if (perPage) {
        options.hitsPerPage = perPage;
      }

      const result = await this.index.search(options);
      return result;
    } catch (err) {
      Logger.error(`algolia search failed: ${err}`);
      return {};
    }
  }
}

export default new SearchService();
