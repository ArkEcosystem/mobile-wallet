const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '//src//assets//i18n');
const masterFileName = 'en.json';

const getMissingKeys = (master, slave, missingKeys, pathPrefix) => {
  if (!missingKeys) {
    missingKeys = [];
  }

  if (typeof master !== 'object') {
    return missingKeys;
  }

  Object.keys(master).forEach(key => {
    const slaveValue = slave ? slave[key] : slave
    const pathKey = pathPrefix ? `${pathPrefix}.${key}` : key;
    if (!slaveValue) {
      missingKeys.push(pathKey);
    }
    getMissingKeys(master[key], slaveValue, missingKeys, pathKey);
  });

  return missingKeys;
};

fs.readFile(path.join(i18nDir, masterFileName), 'utf8', (err, masterJson) => {
  fs.readdir(i18nDir, (err, files) => {
    files.filter(fileName => fileName !== masterFileName).forEach((fileName) => {
      fs.readFile(path.join(i18nDir, fileName), 'utf8', (err, json) => {
        const missingKeys = getMissingKeys(JSON.parse(masterJson), JSON.parse(json));
        if (missingKeys.length) {
          console.log(`Missing translations in ${fileName} (${missingKeys.length}):`);
          missingKeys.forEach(key => console.log(`  ${key}`));
        } else {
          console.log(`File ${fileName} has no missing translations`);
        }
      });
    });
  });
});
