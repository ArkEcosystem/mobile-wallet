import { Injectable } from "@angular/core";
import { Network } from "ark-ts";
import { PublicKey } from "ark-ts/core";
import { isNil } from "lodash";
import { IUserDataProvider } from '@/services/user-data/user-data.interface';

@Injectable({ providedIn: "root" })
export class NetworkProvider {
	public get currentNetwork(): Network {
		return this.userDataProvider.currentNetwork;
	}

	public constructor(private userDataProvider: IUserDataProvider) {}

	public isValidAddress(address: string, specificVersion?: number): boolean {
		const network: Network = !isNil(specificVersion)
			? ({ version: specificVersion } as any)
			: this.currentNetwork;
		return (
			address && network && PublicKey.validateAddress(address, network)
		);
	}
}
