import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { IntroActions } from "./shared/intro.actions";
import { IntroState } from "./shared/intro.state";

@Component({
	selector: "page-intro",
	templateUrl: "intro.component.html",
	styleUrls: ["intro.component.pcss"],
})
export class IntroPage implements OnInit {
	@Select(IntroState.isFinished)
	public isFinished$: Observable<boolean>;

	@ViewChild(IonSlides)
	public slider: IonSlides;

	public showSkip = true;
	public slides: any[];

	constructor(
		private translateService: TranslateService,
		private store: Store,
		private navCtrl: NavController,
	) {}

	ngOnInit() {
		this.isFinished$.subscribe((isFinished) => {
			if (isFinished) {
				this.navCtrl.navigateRoot("login", {
					animated: false,
				});
			}
		});

		this.translateService
			.get([
				"INTRO_PAGE.WELCOME",
				"INTRO_PAGE.TEXT_1",
				"INTRO_PAGE.SECURITY",
				"INTRO_PAGE.TEXT_2",
				"INTRO_PAGE.FAST_EASY",
				"INTRO_PAGE.TEXT_3",
			])
			.subscribe((translation) => {
				this.slides = [
					{
						title: translation["INTRO_PAGE.WELCOME"],
						image: "onboarding-1",
						description: translation["INTRO_PAGE.TEXT_1"],
					},
					{
						title: translation["INTRO_PAGE.SECURITY"],
						image: "onboarding-2",
						description: translation["INTRO_PAGE.TEXT_2"],
					},
					{
						title: translation["INTRO_PAGE.FAST_EASY"],
						image: "onboarding-3",
						description: translation["INTRO_PAGE.TEXT_3"],
					},
				];
			});
	}

	public handleDone(): void {
		this.store.dispatch(new IntroActions.Done());
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

		if (isFinished) {
			this.handleDone();
		}
	}
}
