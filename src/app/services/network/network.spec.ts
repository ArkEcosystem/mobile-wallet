import { AuthProvider } from "@/services/auth/auth";
import { ForgeProvider } from "@/services/forge/forge";
import { StorageProvider } from "@/services/storage/storage";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Storage } from "@ionic/storage";
import { NetworkProvider } from "./network";

const VALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5ZyM";
const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5z12";

const storage = new Storage({
	name: "__mydb",
	driverOrder: ["indexeddb", "sqlite", "websql"],
});
const storageProvider = new StorageProvider(storage);
const forgeProvider = new ForgeProvider();
const authProvider = new AuthProvider(storageProvider);
const userDataProvider = new UserDataProvider(
	storageProvider,
	authProvider,
	forgeProvider,
);
const networkProvider = new NetworkProvider(userDataProvider);

fdescribe("Network service", () => {
	it("should pass with an valid address", () => {
		// TODO: Get the right version for devnet (just like neoapi, which is 0x17)
		expect(networkProvider.isValidAddress(VALID_ADDRESS, 30)).toBe(true);
	});

	it("should fail with an invalid address", () => {
		// TODO: Get the right version for devnet (just like neoapi, which is 0x17)
		expect(networkProvider.isValidAddress(INVALID_ADDRESS, 30)).toBe(false);
	});

	// TODO: Test returning undefined, probably because we need the right mocked values
	// it("should validate and address without version specified", () => {
	// 	expect(networkProvider.isValidAddress(VALID_ADDRESS)).toBe(true);
	// });

	// TODO: Think about the mock to mount both userDataProvider and networkProvider correctly
	// it('should return the current network', () => {
	// 	console.log({ cNetwork: networkProvider.currentNetwork })
	// 	// expect(networkProvider.currentNetwork).toEqual({})
	// });
});
