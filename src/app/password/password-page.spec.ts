import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { NavController } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	createSpyObject,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { PasswordPageComponent } from "./password-page.component";

describe("Password Page", () => {
	let spectator: SpectatorHost<PasswordPageComponent>;
	const clipboardProvider = {
		provide: Clipboard,
		useValue: createSpyObject(Clipboard),
	};
	const navMock = {
		navigateForward: (path) => path,
	};
	const createHost = createHostComponentFactory({
		component: PasswordPageComponent,
		imports: [RouterTestingModule, TranslateModule.forRoot(), PipesModule],
		componentProviders: [clipboardProvider],
		providers: [
			clipboardProvider,
			{ provide: APP_BASE_HREF, useValue: "/" },
			{ provide: NavController, useValue: navMock },
		],
	});

	const words = [
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
	];

	it("should create", () => {
		spectator = createHost(
			`<password-page [words]="words"></password-page>`,
			{
				hostProps: {
					words,
				},
			},
		);
		const component = spectator.query(byTestId("password-page"));
		expect(component).toBeTruthy();
	});

	it("should navigate to the next step", () => {
		spectator = createHost(
			`<password-page [words]="words"></password-page>`,
			{
				hostProps: {
					words,
				},
			},
		);
		const navCtrl = spectator.get(NavController);
		spyOn(navCtrl, "navigateForward");

		const nextStepButton = spectator.query(
			byTestId("password_page__actions--button-group--next"),
		);
		spectator.click(nextStepButton);

		expect(navCtrl.navigateForward).toHaveBeenCalledWith("/password/check");
	});

	it("should copy words to clipboard", () => {
		spectator = createHost(
			`<password-page [words]="words"></password-page>`,
			{
				hostProps: {
					words,
				},
			},
		);
		const clipboard = spectator.get(Clipboard);
		clipboard.copy.and.resolveTo();

		const copyButton = spectator.query(
			byTestId("password_page__actions--button-group--copy"),
		);
		spectator.click(copyButton);

		expect(clipboard.copy).toHaveBeenCalledWith(words.join(" "));
	});
});
