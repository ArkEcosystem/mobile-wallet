import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides, NavController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Navigate } from "@ngxs/router-plugin";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthProvider } from "@/services/auth/auth";

import { IntroActions } from "./shared/intro.actions";
import { INTRO_STATE_TOKEN } from "./shared/intro.state";
import { IntroStateModel } from "./shared/intro.type";

@Component({
	selector: "page-intro",
	templateUrl: "intro.component.html",
	styleUrls: ["intro.component.pcss"],
})
export class IntroPage implements OnInit {
	@Select(INTRO_STATE_TOKEN)
	public intro$: Observable<IntroStateModel>;

	@ViewChild("slider", { read: IonSlides, static: true })
	slider: IonSlides;

	public showSkip = true;
	public slides: any;
	public paginationSize: Array<number>;

	constructor(
		platform: Platform,
		private navCtrl: NavController,
		private authProvider: AuthProvider,
		private translateService: TranslateService,
		private store: Store,
	) {}

	ngOnInit() {
		this.intro$.subscribe((state) => {
			if (state.isFinished) {
				this.store.dispatch(new Navigate(["/login"]));
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
						image: "welcome-aboard",
						description: translation["INTRO_PAGE.TEXT_1"],
					},
					{
						title: translation["INTRO_PAGE.SECURITY"],
						image: "security",
						description: translation["INTRO_PAGE.TEXT_2"],
					},
					{
						title: translation["INTRO_PAGE.FAST_EASY"],
						image: "fast-easy",
						description: translation["INTRO_PAGE.TEXT_3"],
					},
				];

				this.paginationSize = new Array(this.slides.length);
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
