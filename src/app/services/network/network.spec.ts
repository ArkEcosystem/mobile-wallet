import { UserDataProviderMock } from "@@/test/mocks";
import { StoredNetwork } from "@/models/model";

import { NetworkProvider } from "./network";

const VALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5ZyM";
const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5z12";

const network = new StoredNetwork();
network.version = 30;

const userDataProvider = new UserDataProviderMock();
userDataProvider.currentNetwork = network;

const networkProvider = new NetworkProvider(userDataProvider);

describe("Network service", () => {
	it("should pass with an valid address", () => {
		expect(networkProvider.isValidAddress(VALID_ADDRESS, 30)).toBe(true);
	});

	it("should fail with an invalid address", () => {
		expect(networkProvider.isValidAddress(INVALID_ADDRESS, 30)).toBe(false);
	});

	it("should validate and address without version specified", () => {
		expect(networkProvider.isValidAddress(VALID_ADDRESS)).toBe(true);
	});

	it("should return the current network", () => {
		expect(networkProvider.currentNetwork).toEqual(network);
	});
});
