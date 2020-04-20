import { ModuleWithProviders, NgModule } from "@angular/core";
import { NGXS_PLUGINS } from "@ngxs/store";

import {
	NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS,
	NgxsAsyncStoragePlugin,
} from "./async-storage.plugin";

@NgModule()
export class NgxsAsyncStoragePluginModule {
	static forRoot(config: any): ModuleWithProviders {
		return {
			ngModule: NgxsAsyncStoragePluginModule,
			providers: [
				{
					provide: NGXS_PLUGINS,
					useClass: NgxsAsyncStoragePlugin,
					multi: true,
				},
				{
					provide: NGXS_ASYNC_STORAGE_PLUGIN_OPTIONS,
					useValue: config,
				},
			],
		};
	}
}
