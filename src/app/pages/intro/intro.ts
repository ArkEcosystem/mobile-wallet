import { Component, OnInit, ViewChild } from "@angular/core";
import { IonSlides, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

import { AuthProvider } from "@/services/auth/auth";

@Component({
	selector: "page-intro",
	templateUrl: "intro.html",
	styleUrls: ["intro.pcss"],
})
export class IntroPage implements OnInit {
	public showSkip = true;
	public slides: any[];
	public activeIndex = 0;

	@ViewChild(IonSlides)
	public slider: IonSlides;

	constructor(
		private navCtrl: NavController,
		private authProvider: AuthProvider,
		private translateService: TranslateService,
	) {}

	ngOnInit() {
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
	}

	startApp() {
		this.authProvider.saveIntro().subscribe();

		this.navCtrl.navigateForward("/login", {
			animated: true,
			replaceUrl: true,
		});
	}

	goNext() {
		return this.slider.slideNext();
	}

	async onSlideChanged() {
		const activeIndex = await this.slider.getActiveIndex();
		const slideLength = await this.slider.length();

		if (activeIndex >= slideLength) {
			return;
		}
		this.activeIndex = activeIndex;
		this.showSkip = !(await this.slider.isEnd());
	}
}
