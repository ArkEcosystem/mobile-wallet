import { addDecorator } from "@storybook/angular";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata } from "@storybook/angular";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { of } from "rxjs";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsAsyncStoragePluginModule } from "@ngxs-labs/async-storage-plugin";
import { NgxsStorageService } from "../src/app/services/storage/ngxs-storage";
// @ts-ignore
import enLocale from "../src/assets/i18n/en.json";
import { IonicStorageModule } from "@ionic/storage";

class CustomLoader implements TranslateLoader {
	getTranslation(lang: string) {
		return of(enLocale);
	}
}

addDecorator(
	moduleMetadata({
		imports: [
			IonicModule.forRoot(),
			IonicStorageModule.forRoot(),
			NgxsModule.forRoot([], { developmentMode: true }),
			NgxsAsyncStoragePluginModule.forRoot(NgxsStorageService),
			NgxsReduxDevtoolsPluginModule.forRoot(),
			TranslateModule.forRoot({
				loader: { provide: TranslateLoader, useClass: CustomLoader },
				defaultLanguage: "en",
			}),
		],
	}),
);
