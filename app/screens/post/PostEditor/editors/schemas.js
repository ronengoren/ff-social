import {string, shape} from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const editorMediaScheme = shape({
  type: string,
  localUri: string,
  url: string,
});
