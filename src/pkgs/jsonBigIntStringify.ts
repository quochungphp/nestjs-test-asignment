/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export function jsonBigIntStringify(object: Record<string, any>) {
  for (const key in object) {
    // convert main tree
    if (typeof object[key] == 'bigint') {
      object[key] = object[key].toString();
    }
    for (const property in object[key]) {
      // recursively search for inner branches
      if (typeof object[key][property] == 'object') {
        jsonBigIntStringify(object[key]);
      } else if (typeof object[key][property] == 'bigint') {
        object[key][property] = object[key][property].toString();
      }
    }
  }
  return object;
}
