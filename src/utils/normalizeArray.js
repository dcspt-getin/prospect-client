/* eslint-disable import/no-anonymous-default-export */

export default (array, key) => {
  return array.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};
