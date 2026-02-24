'use strict';
const fs = require('fs');
const typescriptTransform = require('i18next-scanner-typescript');

module.exports = {
  input: [
    'src/**/*.{ts,tsx}', // Scan all .ts and .tsx files
    '!src/**/*.spec.{ts,tsx}', // Exclude test files
    '!src/**/*.test.{ts,tsx}', // Exclude test files
    '!src/i18n/**', // Exclude i18n folder
    '!src/node_modules/**', // Exclude node_modules
    '!src/dist/**', // Exclude dist
    '!src/build/**', // Exclude build
    '!src/assets/**', // Exclude assets
    '!src/styles/**' // Exclude styles
  ],
  output: './',
  options: {
    lngs: ['ru', 'uz', 'en'],
    debug: true,
    sort: true,
    plural: true,
    defaultNs: 'common',
    ns: ['common'], // Only use common namespace
    resource: {
      loadPath: 'public/locales/{{lng}}/common.json',
      savePath: 'public/locales/{{lng}}/common.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    defaultValue: (lng, ns, key) => (lng === 'en' ? key : ''),
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.tsx'], // Only parse .tsx files for Trans
      fallbackKey: (ns, value) => {
        // Clean and normalize key to avoid invalid characters and empty keys
        const cleanKey = value
          .trim()
          .replace(/[\n\r]+/g, ' ')
          .replace(/\s+/g, ' '); // Keep all characters including dots
        return cleanKey || 'unnamed_key_' + Date.now(); // Fallback if key is empty
      }
    },
    keySeparator: false, // Disable key separator to prevent nested objects
    nsSeparator: ':'
  },
  transform: typescriptTransform({
    extensions: ['.ts', '.tsx'],
    tsOptions: {
      target: 'es2017'
    },
    customTransform: function (file, enc, done) {
      // Check if file is a directory
      try {
        const stats = fs.statSync(file.path);
        if (stats.isDirectory()) {
          console.log(`Skipping directory: ${file.path}`);
          return done();
        }
      } catch (err) {
        console.error(`Error checking path ${file.path}:`, err);
        return done();
      }

      const content = fs.readFileSync(file.path, enc);

      // Parse t() functions
      this.parser.parseFuncFromString(
        content,
        { list: ['t', 'i18next.t', 'i18n.t'] },
        (key, options) => {
          if (key && key.trim() !== '') {
            // Skip empty keys
            // Clean key to prevent invalid characters
            const cleanKey = key
              .trim()
              .replace(/[\n\r]+/g, ' ')
              .replace(/\s+/g, ' '); // Keep all characters including dots
            if (cleanKey) {
              console.log(`Function key: ${cleanKey}, Namespace: common, File: ${file.path}`);
              this.parser.set(
                cleanKey,
                Object.assign({}, options, {
                  nsSeparator: ':',
                  keySeparator: false, // Disable key separator for t() keys
                  ns: 'common' // Force common namespace
                })
              );
            } else {
              console.warn(`Empty or invalid function key skipped in ${file.path}: ${key}`);
            }
          }
        }
      );

      if (file.path.endsWith('.tsx')) {
        try {
          this.parser.parseTransFromString(
            content,
            { component: 'Trans', i18nKey: 'i18nKey', keySeparator: false },
            (key, options) => {
              if (key && key.trim() !== '') {
                // Skip empty keys
                const cleanKey = key
                  .trim()
                  .replace(/[\n\r]+/g, ' ')
                  .replace(/\s+/g, ' '); // Keep all characters including dots
                if (cleanKey) {
                  console.log(`Trans key: ${cleanKey}, Namespace: common, File: ${file.path}`);
                  this.parser.set(
                    cleanKey,
                    Object.assign({}, options, {
                      nsSeparator: ':',
                      keySeparator: false, // Disable key separator for Trans keys
                      ns: 'common' // Force common namespace, ignore ns attribute
                    })
                  );
                } else {
                  console.warn(`Empty or invalid Trans key skipped in ${file.path}: ${key}`);
                }
              }
            }
          );
        } catch (err) {
          console.warn(`Unable to parse Trans component in ${file.path}:`, err.message);
        }
      }

      done();
    }
  })
};
