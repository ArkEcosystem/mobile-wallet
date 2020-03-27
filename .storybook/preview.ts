import { addDecorator } from "@storybook/angular";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata } from "@storybook/angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { of } from "rxjs";
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
			TranslateModule.forRoot({
				loader: { provide: TranslateLoader, useClass: CustomLoader },
				defaultLanguage: "en",
			}),
		],
	}),
);
