import { Component, Input, OnChanges } from "@angular/core";
import crypto from "crypto";
import MersenneTwister from "mersenne-twister";

import { IdenticonConfig } from "./identicon.config";

@Component({
	selector: "identicon",
	templateUrl: "identicon.component.html",
	styleUrls: ["identicon.component.pcss"],
})
export class IdenticonComponent implements OnChanges {
	@Input()
	public value = "";

	public gradients = "";

	constructor() {}

	ngOnChanges() {
		this.gradients = this.generateGradients();
	}

	private generateGradients(): string {
		const gradients = [];
		const shapesLength = 5;

		const seed = this.valueToSeed();
		const generator = new MersenneTwister(seed);

		for (let index = 0; index < shapesLength; index++) {
			const { angle, x, y } = this.calculateRandomPoints(generator);
			const color = this.getRandomColor(generator);
			gradients.push(
				`conic-gradient(
					from ${angle * 100}deg at ${x * 100}% ${y * 100}%,
					${color},
					calc(${index} * 100% / ${shapesLength}),
					transparent 0
				)`,
			);
		}

		return gradients.join(",");
	}

	private getRandomColor(generator: any): string {
		const colors = IdenticonConfig.COLORS;
		const idx = Math.floor(colors.length * generator.random());
		const color = colors[idx];
		return color;
	}

	private calculateRandomPoints(generator: any) {
		const random = generator.random();
		const random2 = generator.random();

		const angle = Math.PI * 2 * random;
		const x = Math.abs(Math.sqrt(random2) * Math.cos(angle));
		const y = Math.abs(Math.sqrt(random2) * Math.sin(angle));

		return { angle, x, y };
	}

	private valueToSeed(): number {
		const buffer = Buffer.from(this.value, "utf-8");
		const hash = crypto.createHash("sha1").update(buffer).digest("latin1");
		// Change hash into a 32 bit int for our seed
		const seed =
			(hash.charCodeAt(0) << 24) |
			(hash.charCodeAt(1) << 16) |
			(hash.charCodeAt(2) << 8) |
			hash.charCodeAt(3);
		return seed;
	}
}
