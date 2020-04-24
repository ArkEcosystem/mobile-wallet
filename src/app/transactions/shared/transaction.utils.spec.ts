import { getTotalSpent } from "./transaction.utils";

describe("Transaction Utils", () => {
	it("should get total spent", () => {
		const transaction = {
			amount: "1",
			fee: "2",
			id: undefined,
			nonce: undefined,
			sender: undefined,
			recipient: undefined,
			signature: undefined,
		};
		expect(getTotalSpent(transaction)).toBe("3");
	});
});
