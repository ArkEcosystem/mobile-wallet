import { Injectable } from "@angular/core";
import { Network } from "ark-ts";
import { PublicKey } from "ark-ts/core";
import { isNil } from "lodash";

import { UserDataService } from "@/services/user-data/user-data.interface";

@Injectable({ providedIn: "root" })
export class NetworkProvider {
	public constructor(private userDataService: UserDataService) {}

	public get currentNetwork(): Network {
		return this.userDataService.currentNetwork;
	}

	public isValidAddress(address: string, specificVersion?: number): boolean {
		const network: Network = !isNil(specificVersion)
			? ({ version: specificVersion } as any)
			: this.currentNetwork;
		return (
			address && network && PublicKey.validateAddress(address, network)
		);
	}
}
