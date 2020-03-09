import { StoredNetwork, Wallet, Profile } from '@/models/model';

export interface IUserDataProvider {
	currentNetwork: StoredNetwork;
	currentWallet: Wallet;
	currentProfile: Profile;

	profiles: Record<string, Profile>;
	networks: Record<string, StoredNetwork>;
}
