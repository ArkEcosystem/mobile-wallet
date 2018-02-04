# Translations

You can help out by translating the ARK Mobile project to your language! 

## Steps

1. Go to the `src/assets/i18n/` folder and create a new .json file with the [ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code of your chosen language (e.g. `nl.json` for Dutch). If this file already exists, you can skip to the [Missing translations](#missing-translations) section.
2. You can now start with adding your translations to the file you've just created. Make sure to copy the keys as defined in the `en.json` file to ensure that your translations end up in the mobile app.
3. For your translations to work in the app, you'll have to add a language entry to the selection list in the settings of the app. You can find this list in the `src/providers/settings-data/settings-data.ts` file.
4. You can now run the app, go to the settings screen and select your newly added language to inspect your translations throughout the app!

## Missing translations

If the language already exists, you can check for any missing translations by running the `npm run missing-translations` command. This will print a list of keys that haven't been translated yet, for each of the available language files. If the command returns `File your-language.json has no missing translations`, it has been fully translated!