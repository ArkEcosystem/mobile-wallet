import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { switchMapTo } from "rxjs/operators";

import { OnboardingService } from "./shared/onboarding.service";

@Component({
	selector: "onboarding",
	templateUrl: "onboarding.component.html",
	styleUrls: ["onboarding.component.pcss"],
})
export class OnboardingComponent implements OnInit {
	@ViewChild(IonSlides)
	public slider: IonSlides;

	public showSkip = true;
	public slides: any[];

	constructor(
		private translateService: TranslateService,
		private onboardingService: OnboardingService,
		private navCtrl: NavController,
	) {}

	ngOnInit() {
		this.translateService
			.get([
				"ONBOARDING.WELCOME",
				"ONBOARDING.TEXT_1",
				"ONBOARDING.SECURITY",
				"ONBOARDING.TEXT_2",
				"ONBOARDING.FAST_EASY",
				"ONBOARDING.TEXT_3",
			])
			.subscribe((translation) => {
				this.slides = [
					{
						title: translation["ONBOARDING.WELCOME"],
						image: "onboarding-welcome",
						description: translation["ONBOARDING.TEXT_1"],
					},
					{
						title: translation["ONBOARDING.SECURITY"],
						image: "onboarding-security",
						description: translation["ONBOARDING.TEXT_2"],
					},
					{
						title: translation["ONBOARDING.FAST_EASY"],
						image: "onboarding-easy",
						description: translation["ONBOARDING.TEXT_3"],
					},
				];
			});
	}

	public handleDone(): void {
		this.onboardingService
			.save()
			.pipe(switchMapTo(this.navCtrl.navigateRoot("/login")))
			.subscribe();
	}

	public handleNext(): void {
		this.slider.slideNext();
	}

	public async onSlideChanged(): Promise<void> {
		const activeIndex = await this.slider.getActiveIndex();
		const slideLength = await this.slider.length();

		if (activeIndex >= slideLength) {
			return;
		}

		const isFinished = await this.slider.isEnd();
		this.showSkip = !isFinished;
	}
}
