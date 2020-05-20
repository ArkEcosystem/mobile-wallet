import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { NavController } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { PasswordPageComponent } from "./password-page.component";

const navMock = {
	navigateForward: (path) => path,
};

describe("Password Page", () => {
	let spectator: SpectatorHost<PasswordPageComponent>;
	const createHost = createHostComponentFactory({
		component: PasswordPageComponent,
		imports: [RouterTestingModule, TranslateModule.forRoot(), PipesModule],
		providers: [
			{ provide: APP_BASE_HREF, useValue: "/" },
			{ provide: NavController, useValue: navMock },
		],
	});

	it("should create", () => {
		spectator = createHost(
			`<password-page [words]="words"></password-page>`,
			{
				hostProps: {
					words: [
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
					],
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
					words: [
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
					],
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
});
