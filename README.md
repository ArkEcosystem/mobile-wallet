![ARK Mobile](https://i.imgur.com/0BjkC9C.png)

# Ark Mobile
> A Wallet for Everyone

ARK’s mobile wallet is a hybrid application (using the same codebase for Android and iOS which helps with coordinated development). Created using Ionic framework and ARK’s [TypeScript API](https://github.com/ArkEcosystem/ark-ts) to interact with the ARK network via your mobile phone, anytime, anywhere (as long as you have an internet connection).

## Download

- [Google Play](https://play.google.com/store/apps/details?id=io.ark.wallet.mobile)
- App Store (Waiting for approval from Apple)
- Ionic View (for iOS):
  1. Install [Ionic View — Test Ionic Apps](https://itunes.apple.com/us/app/ionic-view-test-ionic-apps/id1271789931?mt=8)
  1. Open and click the eye at the bottom
  1. Enter the ID **0894ffa2** and “View App”

## Features

- Import your existing passphrase (import by QR Scanner or write/paste your passphrase).
- Generate a new passphrase.
- Encrypt access to your profile with a custom 6 digit PIN (AES256+PBKDF2).
- Most transaction types are available: send, receive, vote, unvote, register a delegate.
- Connects to both mainnet and devnet.
- Option for additional profiles (separate profiles for different ARK addresses or networks).
- Option to add contacts and easily transact with them.
- Total balance of your combined ARK addresses.
- Wallet backup - input your selected PIN to decrypt your wallet and gain view of your private data.
- Change PIN - if you want to change your encryption/decryption PIN you can easily do so..
- Clear Data — you can clear all your data from the phone.
- Overview of network status with an option to change peer.
- Current market value, along with weekly movements.
- Support for showing data in different FIAT currencies.

## Build

First follow the steps below to install the dependencies:

```bash
$ npm install -g ionic cordova
$ npm install
$ ionic cordova prepare
```

Run on device:

```bash
$ ionic cordova run ios
$ ionic cordova run android
```

Debug in browser:

```bash
$ npm run ionic:serve
```

## Contributing

- If you find any bugs, submit an [issue](../../issues) or open [pull-request](../../pulls), helping us catch and fix them.
- Engage with other users and developers on [ARK Slack](https://ark.io/slack/).
- Join to our [gitter](https://gitter.im/ark-developers/Lobby).
- [Contribute bounties](./CONTRIBUTING.md).

## Authors
- Lúcio Rubens <lucio@ark.io>
- Alex Barnsley <alex@ark.io>

## License

Ark Mobile is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
