const { getOptions } = require("loader-utils");

module.exports = function proxyImportResolver(source) {
  const options = getOptions(this);
  if (options.preserveImportProxies === true) {
    return source;
  }
  return source.replace(/\.(\w+)\.proxy\.js/g, (fullMatch, originalExt) => {
    if (options.preserveImportProxies === false) {
    return `.${originalExt}`;
    }
    if (options.preserveImportProxies.includes(originalExt)) {
      return fullMatch;
    }
    return `.${originalExt}`;
  });
};
