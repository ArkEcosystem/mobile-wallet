import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, Slides } from 'ionic-angular';

import { AuthProvider } from '@providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  @ViewChild(Slides) slider: Slides;

  public showSkip = true;
  public slides: any;
  public activeIndex = 0;

  constructor(
    platform: Platform,
    private navCtrl: NavController,
    private authProvider: AuthProvider,
    private translateService: TranslateService,
  ) {
    platform.ready().then(() => {
      this.translateService.get([
        'INTRO_PAGE.WELCOME',
        'INTRO_PAGE.TEXT_1',
        'INTRO_PAGE.SECURITY',
        'INTRO_PAGE.TEXT_2',
        'INTRO_PAGE.FAST_EASY',
        'INTRO_PAGE.TEXT_3',
      ]).subscribe((translation) => {
        this.slides = [
          {
            title: translation['INTRO_PAGE.WELCOME'],
            image: 'anytime',
            description: translation['INTRO_PAGE.TEXT_1'],
          },
          {
            title: translation['INTRO_PAGE.SECURITY'],
            image: 'pincode',
            description: translation['INTRO_PAGE.TEXT_2'],
          },
          {
            title: translation['INTRO_PAGE.FAST_EASY'],
            image: 'fast-easy',
            description: translation['INTRO_PAGE.TEXT_3'],
          },
        ];
      });
    });
  }

  startApp() {
    this.authProvider.saveIntro();

    this.navCtrl.setRoot('LoginPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  goNext() {
    this.slider.slideNext();
  }

  slideChanged() {
    const activeIndex = this.slider.getActiveIndex();
    const slideLength = this.slider.length();

    if (activeIndex >= slideLength) { return; }

    this.activeIndex = activeIndex;
    this.showSkip = !this.slider.isEnd();
  }

}
