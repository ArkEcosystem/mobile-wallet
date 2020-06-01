import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostFactory,
	mockProvider,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { sleep } from "@@/test/helpers";
import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { InputAddressComponentModule } from "@/components/input-address/input-address.module";
import { InputCurrencyComponentModule } from "@/components/input-currency/input-currency.module";
import { QRScannerComponent } from "@/components/qr-scanner/qr-scanner";
import { QRScannerComponentModule } from "@/components/qr-scanner/qr-scanner.module";
import { PipesModule } from "@/pipes/pipes.module";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { RecipientListResumeComponentModule } from "./recipient-list-resume/recipient-list-resume.component.module";
import { RecipientListComponentModule } from "./recipient-list/recipient-list.component.module";
import { TransactionSendComponent } from "./transaction-send.component";

fdescribe("Transaction Send", () => {
	let spectator: SpectatorHost<TransactionSendComponent>;
	const createHost = createHostFactory({
		component: TransactionSendComponent,
		imports: [
			IonicModule,
			PipesModule,
			TranslateModule.forRoot(),
			RecipientListResumeComponentModule,
			RecipientListComponentModule,
			InputAddressComponentModule,
			InputCurrencyComponentModule,
			BottomDrawerComponentModule,
			FormsModule,
			ReactiveFormsModule,
			QRScannerComponentModule,
		],
		providers: [
			TranslateService,
			UserDataService,
			mockProvider(QRScannerComponent),
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);

		const component = spectator.query(byTestId("transaction-send"));

		expect(component).toBeTruthy();
	});

	it("should not open bottom drawer if no recipients", () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);

		const recipientListResume = spectator.query(
			byTestId("transaction-send__recipient-list-resume"),
		);
		spectator.click(recipientListResume);

		expect(spectator.component.isRecipientListOpen).toEqual(false);
	});

	it("should open bottom drawer", async () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);
		spectator.component.recipients = [
			{
				address: "A",
				amount: "2",
			},
		];
		const recipientListResume = spectator.query(
			byTestId("transaction-send__recipient-list-resume"),
		);

		spectator.click(recipientListResume);
		await sleep(500);

		expect(spectator.component.isRecipientListOpen).toEqual(true);
	});

	it("should delete a recipient", async () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);
		spectator.component.recipients = [
			{
				address: "A",
				amount: "2",
			},
			{
				address: "B",
				amount: "2",
			},
		];
		spectator.component.deleteRecipient("B");

		expect(spectator.component.recipients).toEqual([
			{
				address: "A",
				amount: "2",
			},
		]);
	});

	it("should add a recipient", async () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);
		spectator.component.transactionForm.controls.address.setValue("AAAA");
		spectator.component.transactionForm.controls.amount.setValue("2");

		const addButton = spectator.query(
			byTestId("transaction-send__buttons--add"),
		);
		spectator.click(addButton);

		expect(spectator.component.recipients).toEqual([
			{
				address: "AAAA",
				amount: "2",
			},
		]);
	});

	it("should create a transaction object", async () => {
		spectator = createHost(
			`<ion-content><transaction-send></transaction-send></ion-content>`,
		);
		spectator.component.recipients = [
			{
				address: "A",
				amount: "2",
			},
			{
				address: "B",
				amount: "2",
			},
		];

		expect(spectator.component.createTransaction()).toEqual({
			totalAmount: "022",
			recipients: ["A", "B"],
		});
	});

	it("should call the qr code scanner", async () => {
		const qrScanner = spectator.get(QRScannerComponent);
		console.log({ qrScanner });
		const qrCodeButton = spectator.query(
			byTestId("input-address__button--qrcode"),
		);
		spectator.click(qrCodeButton);
		sleep(500);

		expect(qrScanner.open).toHaveBeenCalledWith(true);
	});
});
