import { Injectable } from "@angular/core";
import pino, { Logger } from "pino";
import { inspect } from "util";

@Injectable({ providedIn: "root" })
export class LoggerService {
	public logs: any[] = [];

	private logger: Logger;

	constructor() {
		this.logger = pino({
			prettyPrint: true,
			browser: {
				serialize: true,
				write: (o) => {
					this.logs.push(o);
				},
			},
		});
	}

	public error(message: any): void {
		this.log("error", message);
	}

	public warn(message: any): void {
		this.log("warn", message);
	}

	public info(message: any): void {
		this.log("info", message);
	}

	private log(level: string, message: any): void {
		if (typeof message !== "string") {
			message = inspect(message, { depth: 1 });
		}
		this.logger[level](message);
	}
}
