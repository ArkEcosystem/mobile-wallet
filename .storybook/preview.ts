import { addDecorator } from "@storybook/angular";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata } from "@storybook/angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { of } from "rxjs";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
// @ts-ignore
import enLocale from "../src/assets/i18n/en.json";

class CustomLoader implements TranslateLoader {
	getTranslation(lang: string) {
		return of(enLocale);
	}
}

addDecorator(
	moduleMetadata({
		imports: [
			IonicModule.forRoot(),
			NgxsModule.forRoot([]),
			NgxsReduxDevtoolsPluginModule.forRoot(),
			TranslateModule.forRoot({
				loader: { provide: TranslateLoader, useClass: CustomLoader },
				defaultLanguage: "en",
			}),
		],
	}),
);
