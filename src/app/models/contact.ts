export interface AddressMap {
	index: string;
	key: string;
	value: string;
	highlight?: boolean;
	hasMore?: boolean;
}

export interface Contact {
	address: string;
	name: string;
	description?: string;
}
