# Ark Mobile

<p align="center">
    <img src="./banner.png" />
</p>

> A Wallet for Everyone

[![Build Status](https://badgen.now.sh/circleci/github/ArkEcosystem/mobile-wallet)](https://circleci.com/gh/ArkEcosystem/mobile-wallet)
[![Codecov](https://badgen.now.sh/codecov/c/github/arkecosystem/mobile-wallet)](https://codecov.io/gh/arkecosystem/mobile-wallet)
[![Latest Version](https://badgen.now.sh/github/release/ArkEcosystem/mobile-wallet)](https://github.com/ArkEcosystem/mobile-wallet/releases/latest)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

> Lead Maintainer: [Lúcio Rubens](https://github.com/luciorubeens)

ARK’s mobile wallet is a hybrid application (using the same codebase for Android and iOS which helps with coordinated development).

## Download

-   [Google Play](https://play.google.com/store/apps/details?id=io.ark.wallet.mobile)
-   [App Store](https://itunes.apple.com/us/app/mobile-ark/id1324625967)

## Installation

### Node Setup

Download and install [Node.js](https://nodejs.org/).

Then follow the steps below:

```bash
npm install -g @ionic/cli cordova
npm install -g cordova-res native-run
npm install
ionic cordova prepare
```

### iOS Setup

Download and install [Xcode](https://developer.apple.com/xcode/).

Then make sure the command-line tools are selected for use:

```bash
xcode-select --install
```

And you need to install some utilities:

```bash
npm install -g ios-sim
npm install -g ios-deploy
```

### Android Setup

Download and install:

-   [JDK8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
-   [Gradle](https://gradle.org/install/)
-   [Android Studio](https://developer.android.com/studio/)

Then install Android SDK (API 28) on Android Studio and configure the [environment variables](https://developer.android.com/studio/command-line/variables) (`ANDROID_SDK_ROOT`).

## Usage

Debug in device:

```bash
npm run debug:ios
npm run debug:android
```

Debug in browser (without Cordova plugins):

```bash
npm start
```

## Build

Run the command to create a build for the specific platform:

```bash
npm run build:ios
npm run build:android
```

### iOS Deploy

-   Download the `Development` and `Distribution` certificates in [Apple's member center](https://developer.apple.com/membercenter)
-   Open Xcode and import the workspace file in `/platforms/ios`
-   Check the `Signing and Capabilities` tab to ensure that the `Provisioning Profile` is set correctly
-   Go to `Product` > `Archive` in menu.
-   Proceed in `Distribute App` wizard.
-   `App Store Connect` > `Upload`. Then it will be listed on [iTunes Connect](https://itunesconnect.apple.com/)
-   `App Store Connect` > `Export` to create the `.ipa` file

### Android Deploy

-   Open the output directory `cd platforms/android/build/outputs/apk`
-   Generate a private key to sign the APK (skip this if you already have one):

```bash
keytool -genkey -v -keystore release-key.keystore -alias ark -keyalg RSA -keysize 2048 -validity 10000
```

-   Sign the unsigned APK:

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./release-key.keystore app-release-unsigned.apk mobile-app
```

-   Optimize the APK:

```bash
zipalign -v 4 app-release-unsigned.apk AppRelease.apk
```

-   Open the [Google Play Store Developer Console](https://play.google.com/apps/publish) and upload the `AppRelease.apk`

## Testing

```bash
npm test
```

## Contributing

-   If you find any bugs, submit an [issue](../../issues) or open [pull-request](../../pulls), helping us catch and fix them.
-   Engage with other users and developers on [ARK Slack](https://ark.io/slack/).
-   [Contribution bounties](https://docs.ark.io/guidebook/contribution-guidelines/contributing.html).
-   [Help translate](./TRANSLATING.md).

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
