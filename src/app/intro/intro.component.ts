import { Component, ViewChild } from "@angular/core";
import { IonSlides, NavController, Platform } from "@ionic/angular";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthProvider } from "@/services/auth/auth";
import { TranslateService } from "@ngx-translate/core";
import { Navigate } from "@ngxs/router-plugin";
import { IntroActions } from "./shared/intro.actions";
import { INTRO_STATE_TOKEN } from "./shared/intro.state";
import { IntroStateModel } from "./shared/intro.type";

@Component({
	selector: "page-intro",
	templateUrl: "intro.component.html",
	styleUrls: ["intro.pcss"],
})
export class IntroPage {
	@Select(INTRO_STATE_TOKEN)
	public intro$: Observable<IntroStateModel>;
	public isFinished$: Observable<IntroStateModel>;

	@ViewChild("slider", { read: IonSlides, static: true })
	slider: IonSlides;

	public showSkip = true;
	public slides: any;

	constructor(
		platform: Platform,
		private navCtrl: NavController,
		private authProvider: AuthProvider,
		private translateService: TranslateService,
		private store: Store,
	) {
		const hasFinishedIntro = this.store
			.select(state => state.intro.isFinished)
			.subscribe(isFinished => isFinished);

		if (hasFinishedIntro) {
			this.store.dispatch(new Navigate(["/login"]));
		}

		platform.ready().then(() => {
			this.translateService
				.get([
					"INTRO_PAGE.WELCOME",
					"INTRO_PAGE.TEXT_1",
					"INTRO_PAGE.SECURITY",
					"INTRO_PAGE.TEXT_2",
					"INTRO_PAGE.FAST_EASY",
					"INTRO_PAGE.TEXT_3",
				])
				.subscribe(translation => {
					this.slides = [
						{
							title: translation["INTRO_PAGE.WELCOME"],
							image: "anytime",
							description: translation["INTRO_PAGE.TEXT_1"],
						},
						{
							title: translation["INTRO_PAGE.SECURITY"],
							image: "pincode",
							description: translation["INTRO_PAGE.TEXT_2"],
						},
						{
							title: translation["INTRO_PAGE.FAST_EASY"],
							image: "fast-easy",
							description: translation["INTRO_PAGE.TEXT_3"],
						},
					];
				});
		});
	}

	startApp() {
		this.authProvider.saveIntro();

		this.navCtrl.navigateForward("/login", {
			animated: true,
			replaceUrl: true,
		});

		return this.store.dispatch(new IntroActions.Done());
	}

	goNext() {
		this.slider.slideNext();
	}

	async onSlideChanged() {
		const activeIndex = await this.slider.getActiveIndex();
		const slideLength = await this.slider.length();

		if (activeIndex >= slideLength) {
			return;
		}

		const isFinished = await this.slider.isEnd();
		this.showSkip = !isFinished;

		return this.store.dispatch(
			new IntroActions.Update({ activeIndex, isFinished }),
		);
	}
}
