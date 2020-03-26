import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";

import { LoggerService } from "../logger/logger.service";

@Injectable()
export class GlobalErrorHandlerService extends ErrorHandler {
	constructor(
		private injector: Injector,
		private loggerService: LoggerService,
	) {
		super();
	}

	handleError(error: any) {
		const router = this.injector.get(Router);
		const url = router?.url;

		this.loggerService.error([url, error]);
		super.handleError(error);
	}
}
