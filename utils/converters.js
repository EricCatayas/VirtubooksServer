/**
 * Converts an array of objects with an 'id' property to a map keyed by 'id'.
 * @param {Array<{id: string}>} arr
 * @returns {{ [id: string]: object }}
 */
function arrayToIdMap(arr) {
  return arr.reduce((map, item) => {
    if (item && item.id) {
      if (!map[item.id]) {
        map[item.id] = item;
      }
    }
    return map;
  }, {});
}

module.exports = {
  arrayToIdMap,
};
