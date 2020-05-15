import {
	addDecorator,
	moduleMetadata,
	addParameters,
} from "@storybook/angular";
import { IonicModule } from "@ionic/angular";
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
		],
	}),
);
