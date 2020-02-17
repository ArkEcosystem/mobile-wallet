// BLOCKCHAIN
export const BLOCKCHAIN_PREMINED = 125000000;

// WALLET
export const ARKTOSHI_DP = 8;
export const WALLET_UNIT_TO_SATOSHI = 100000000;
export const WALLET_REFRESH_PRICE_MILLISECONDS = 500 * 1000;
export const WALLET_REFRESH_TRANSACTIONS_MILLISECONDS = 10 * 1000;
export const WALLET_MIN_NUMBER_CONFIRMATIONS = 51;
export const BIP39_DOCUMENTATION_URL =
	"https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki";

// TRANSACTION SEND
export const TRANSACTION_ADDRESS_SIZE = 20;

// STORAGE
export const STORAGE_MARKET_TICKER = "market_ticker";
export const STORAGE_MARKET_HISTORY = "market_history";
export const STORAGE_LOGIN = "login";
export const STORAGE_PROFILES = "profiles";
export const STORAGE_NETWORKS = "network";
export const STORAGE_SETTINGS = "settings";
export const STORAGE_ACTIVE_PROFILE = "active_profile";
export const STORAGE_INTROSEEN = "intro";
export const STORAGE_DELEGATES = "delegates";
export const STORAGE_FEES = "fees";
export const STORAGE_MASTERPASSWORD = "masterpassword";
export const STORAGE_AUTH_UNLOCK_TIMESTAMP = "auth_timestamp";
export const STORAGE_AUTH_ATTEMPTS = "auth_attempts";

// TOAST
export const TOAST_HIDE_DELAY = 3000;
export const TOAST_POSITION = "bottom";

// COIN MARKETCAP API
export const API_MARKET_URL = "https://min-api.cryptocompare.com";

// GENERIC
export const VIBRATION_TIME_MS = 30;
export const VIBRATION_TIME_LONG_MS = 200;
export const APP_TIMEOUT_DESTROY = 60000;

// PIN
export const PIN_ATTEMPTS_LIMIT = 3;
export const PIN_ATTEMPTS_TIMEOUT_MILLISECONDS = 30 * 1000;

// ARK
export const PRIVACY_POLICY_URL = "https://ark.io/PrivacyPolicy.txt";
export const URI_QRCODE_SCHEME_PREFIX = "ark:";
export const NUM_ACTIVE_DELEGATES = 51;
export const TOP_WALLETS_TO_FETCH = 50;

export const TRANSACTION_GROUPS = {
	STANDARD: 1,
	MAGISTRATE: 2,
};

export const TRANSACTION_TYPES = {
	MULTI_SIGN: -1,

	GROUP_1: {
		TRANSFER: 0,
		SECOND_SIGNATURE: 1,
		DELEGATE_REGISTRATION: 2,
		VOTE: 3,
		MULTI_SIGNATURE: 4,
		IPFS: 5,
		MULTI_PAYMENT: 6,
		DELEGATE_RESIGNATION: 7,
		HTLC_LOCK: 8,
		HTLC_CLAIM: 9,
		HTLC_REFUND: 10,
	},

	GROUP_2: {
		BUSINESS_REGISTRATION: 0,
		BUSINESS_RESIGNATION: 1,
		BUSINESS_UPDATE: 2,
		BRIDGECHAIN_REGISTRATION: 3,
		BRIDGECHAIN_RESIGNATION: 4,
		BRIDGECHAIN_UPDATE: 5,
	},
};
