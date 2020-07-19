import {apiCommand} from '../apiCommands/actions';
import blobFetcher from '../../infra/blob/blobFetcher';
import {fetchTypes, uploadStateTypes} from '../../vars/enums';
import {uniqueId} from '../../infra/utils';

export const UPLOAD_START = 'UPLOAD_START';
export const UPLOAD_PROGRESS_UPDATE = 'UPLOAD_PROGRESS_UPDATE';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE';
export const UPLOAD_CANCEL_SIGNAL = 'UPLOAD_CANCEL_SIGNAL';
export const UPLOAD_CANCEL = 'UPLOAD_CANCEL';

function throwExceptionIfCancelSignaled(state, uploadId, msg) {
  if (state.uploads[uploadId] === fetchTypes.CANCEL_SIGNALED) {
    throw new Error(msg);
  }
}

export const updateProgress = ({uploadId, value}) => ({
  type: UPLOAD_PROGRESS_UPDATE,
  payload: {uploadId, value},
});

// eslint-disable-next-line consistent-return
export const upload = ({
  entityType,
  fileName,
  filePath,
  uploadId = uniqueId(),
  onError,
  onStart,
  onFinish,
}) => async (dispatch, getState) => {
  dispatch({type: UPLOAD_START, payload: {uploadId}});

  if (onStart) {
    onStart(uploadId);
  }

  try {
    const res = await dispatch(
      apiCommand('uploads.gettoken', {entityType, filename: fileName}),
    );

    throwExceptionIfCancelSignaled(getState(), uploadId, 'pre-fetch-cancel');

    const {params, uploadEndpoint} = res.data.data;
    const formData = Object.keys(params).map((key) => ({
      name: key,
      data: params[key],
    }));
    formData.push({
      name: 'file',
      filename: fileName,
      data: blobFetcher.wrap(filePath),
    });

    await blobFetcher.fetch({
      fetchId: uploadId,
      fetchType: fetchTypes.UPLOAD,
      method: 'POST',
      url: uploadEndpoint,
      body: formData,
      onProgress: (value) => dispatch(updateProgress({uploadId, value})),
    });

    dispatch({type: UPLOAD_SUCCESS, payload: {uploadId}});

    // not extracting the file url from the response to avoid XML parsing (JSON is not supported by S3).
    // using the signature data supposed to be valid in the same manner.
    const url = `${uploadEndpoint}/${params.key}`;
    return {url};
  } catch (err) {
    if (
      err.message === 'cancelled' ||
      err.message === 'Canceled' ||
      err.message === 'pre-fetch-cancel'
    ) {
      // 'cancelled' is thrown at iOS by RNFetchBlob when cancelled during fetch, and 'Canceled' at Android. 'pre-fetch-cancel' is thrown between phases.
      dispatch({type: UPLOAD_CANCEL, payload: {uploadId}});
      return {err: uploadStateTypes.CANCELLED};
    } else {
      dispatch({type: UPLOAD_FAILURE, payload: {uploadId}});
      if (onError) {
        onError(err);
      }
      return {err: uploadStateTypes.FAILED};
    }
  } finally {
    if (onFinish) {
      onFinish();
    }
  }
};

export const cancelUpload = ({uploadId}) => (dispatch) => {
  dispatch({type: UPLOAD_CANCEL_SIGNAL, payload: {uploadId}});
  blobFetcher.cancel(uploadId);
};
