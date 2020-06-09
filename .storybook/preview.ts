import {
	addDecorator,
	moduleMetadata,
	addParameters,
} from "@storybook/angular";
import { IonicModule } from "@ionic/angular";
import { Injectable } from "@angular/core";
import {
	HammerModule,
	HAMMER_GESTURE_CONFIG,
	HammerGestureConfig,
} from "@angular/platform-browser";
import * as Hammer from "hammerjs";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { of } from "rxjs";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
// @ts-ignore
import enLocale from "../src/assets/i18n/en.json";
import { IonicStorageModule } from "@ionic/storage";

class CustomLoader implements TranslateLoader {
	getTranslation(lang: string) {
		return of(enLocale);
	}
}

@Injectable()
class MyHammerConfig extends HammerGestureConfig {
	overrides: any = {
		swipe: { direction: Hammer.DIRECTION_ALL },
	};
}

addParameters({
	options: {
		showRoots: true,
	},
});

addDecorator(
	moduleMetadata({
		imports: [
			IonicModule.forRoot(),
			IonicStorageModule.forRoot(),
			NgxsModule.forRoot([], { developmentMode: true }),
			NgxsReduxDevtoolsPluginModule.forRoot(),
			TranslateModule.forRoot({
				loader: { provide: TranslateLoader, useClass: CustomLoader },
				defaultLanguage: "en",
			}),
			HammerModule,
		],
		providers: [
			{ provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
		],
	}),
);
