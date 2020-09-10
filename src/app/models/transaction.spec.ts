import businessRegistrationFixture from "@@/test/fixture/transactions/business-registration.json";
import legacyBusinessRegistrationFixture from "@@/test/fixture/transactions/legacy-business-registration.json";
import secondSignatureFixture from "@@/test/fixture/transactions/second-signature.json";
import transferFixture from "@@/test/fixture/transactions/transfer.json";

import { Transaction } from "./transaction";

const fixtures = {
	transfer: transferFixture,
	secondSignature: secondSignatureFixture,
	legacyBusinessRegistration: legacyBusinessRegistrationFixture,
	businessRegistration: businessRegistrationFixture,
};

describe("Transaction Model", () => {
	const subject = new Transaction(fixtures.transfer.data.sender);

	it("should deserialize", () => {
		const transaction = subject.deserialize(fixtures.transfer.data);
		expect(transaction).toBeTruthy();
	});

	it("isTransfer", () => {
		const transaction = subject.deserialize(fixtures.transfer.data);
		expect(transaction.isTransfer()).toBeTrue();
	});

	it("isSecondSignature", () => {
		const transaction = subject.deserialize(fixtures.secondSignature.data);
		expect(transaction.isSecondSignature()).toBeTrue();
	});

	it("isLegacyBusinessRegistration", () => {
		const transaction = subject.deserialize(
			fixtures.legacyBusinessRegistration.data,
		);
		expect(transaction.isLegacyBusinessRegistration()).toBeTrue();
	});

	it("isBusinessRegistration", () => {
		const transaction = subject.deserialize(
			fixtures.businessRegistration.data,
		);
		expect(transaction.isBusinessEntityRegistration()).toBeTrue();
	});

	it("should get type label", () => {
		const transfer = subject.deserialize(fixtures.transfer.data);
		expect(transfer.getTypeLabel()).toBe("TRANSACTIONS_PAGE.SENT");
	});
});
