import apiClient from '../apiClient';

export default {
  scrapeUrl: ({url}) => apiClient.get(`/scrapedUrls/preview?url=${url}`),
};
