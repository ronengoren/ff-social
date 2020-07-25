/* eslint-disable no-useless-escape */
const errorText = {
  email: 'Please enter a valid Email',
  url: 'Please enter a valid url',
  time: 'Please enter a valid time',
  matchingPasswords: 'Your password and confirmation password do not match',
  maxLength: (max) => `Max. ${max} chars`,
  minLength: (min) => `Min. ${min} chars`,
  maxWords: (max) => `Max ${max} words`,
  minWords: (min) => `Minimum ${min} words`,
};

export const regexs = {
  isFacebookEmail: new RegExp(/@facebook.homeis.com/),
  email: new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  ),
  url: new RegExp(
    '^((http(s)?:\\/\\/)?(www\\.)?)[a-z0-9]+([-.]{1}[a-z0-9]+)*\\.[a-z]{2,3}(:[0-9]{1,5})?(\\/[^\\s]*)?',
    'im',
  ),
  time: new RegExp(/((([0]?)|[1])\d):?[0-5]\d\s?([AaPp][Mm])/),
};

const validState = () => ({isValid: true, errorText: ''});

export const email = (customError) => (value) => {
  if (
    !value ||
    (regexs.email.test(value) && !regexs.isFacebookEmail.test(value))
  ) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.email,
  };
};

export const url = (customError) => (value) => {
  if (!value || regexs.url.test(value)) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.url,
  };
};

export const maxLength = (maxLength, customError) => (value) => {
  if (value.length <= maxLength) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.maxLength(maxLength),
  };
};

export const minLength = (minLength, customError) => (value) => {
  if (value.length >= minLength) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.minLength(minLength),
  };
};

export const minWords = (minWords, customError) => (value) => {
  const wordsCount = value.trim().split(/\s+/).length;
  if (wordsCount >= minWords) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.minWords(minWords),
  };
};

export const maxWords = (minWords, customError) => (value) => {
  const wordsCount = value.trim().split(/\s+/).length;
  if (wordsCount <= maxWords) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.maxWords(maxWords),
  };
};

export const time = (customError) => (value) => {
  if (!value || regexs.time.test(value)) {
    return validState();
  }

  return {
    isValid: false,
    errorText: customError || errorText.time,
  };
};
