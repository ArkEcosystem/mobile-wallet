import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { OnboardingActions } from "./shared/onboarding.actions";
import { OnboardingState } from "./shared/onboarding.state";

@Component({
	selector: "onboarding",
	templateUrl: "onboarding.component.html",
	styleUrls: ["onboarding.component.pcss"],
})
export class OnboardingComponent implements OnInit {
	@Select(OnboardingState.isFinished)
	public isFinished$: Observable<boolean>;

	@ViewChild(IonSlides)
	public slider: IonSlides;

	public showSkip = true;
	public slides: any[];

	constructor(
		private translateService: TranslateService,
		private store: Store,
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
						image: "onboarding-1",
						description: translation["ONBOARDING.TEXT_1"],
					},
					{
						title: translation["ONBOARDING.SECURITY"],
						image: "onboarding-2",
						description: translation["ONBOARDING.TEXT_2"],
					},
					{
						title: translation["ONBOARDING.FAST_EASY"],
						image: "onboarding-3",
						description: translation["ONBOARDING.TEXT_3"],
					},
				];
			});
	}

	public handleDone(): void {
		this.store.dispatch(new OnboardingActions.Done());
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
