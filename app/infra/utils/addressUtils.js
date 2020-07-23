// eslint-disable-next-line import/prefer-default-export
export function removeAddressSuffix(fullAddress) {
  const stateAndCountrySuffix = fullAddress.split(',');
  if (stateAndCountrySuffix.length > 1) {
    return `${stateAndCountrySuffix[0]},${stateAndCountrySuffix[1]}`;
  }
  return fullAddress;
}
