import { ModuleWithProviders, NgModule } from "@angular/core";
import { NGXS_PLUGINS } from "@ngxs/store";

import { NgxsAsyncStoragePlugin } from "./async-storage.plugin";
import { NgxsAsyncStorageService } from "./async-storage.service";

@NgModule()
export class NgxsAsyncStoragePluginModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NgxsAsyncStoragePluginModule,
			providers: [
				{
					provide: NGXS_PLUGINS,
					useClass: NgxsAsyncStoragePlugin,
					multi: true,
				},
				NgxsAsyncStorageService,
			],
		};
	}
}
