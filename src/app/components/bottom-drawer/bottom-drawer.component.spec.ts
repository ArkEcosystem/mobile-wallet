import { createHostComponentFactory, SpectatorHost } from "@ngneat/spectator";

import { sleep } from "@@/test/helpers";

import { BottomDrawerComponent } from "./bottom-drawer.component";

fdescribe("Bottom Drawer Component", () => {
	let spectator: SpectatorHost<BottomDrawerComponent>;
	const createHost = createHostComponentFactory({
		component: BottomDrawerComponent,
	});

	it("should create", async () => {
		spectator = createHost(
			`<bottom-drawer [isOpen]="true"></bottom-drawer>`,
		);
		await sleep(100);
		const element = spectator.query("body > .c-bottom-drawer", {
			root: true,
		});
		expect(element).toBeTruthy();
		expect(element).toHaveStyle({ position: "absolute" });
	});

	it("should hide programmatically", async () => {
		spectator = createHost(
			`<bottom-drawer [isOpen]="isOpen"></bottom-drawer>`,
			{
				hostProps: {
					isOpen: true,
				},
			},
		);
		await sleep(100);
		spectator.setHostInput({ isOpen: false });
		await sleep(300);
		const element = spectator.query("body > .c-bottom-drawer", {
			root: true,
		});
		expect(element).toHaveStyle({ display: "none" });
	});

	it("should emit event on dismiss", async () => {
		spectator = createHost(
			`<bottom-drawer [isOpen]="isOpen"></bottom-drawer>`,
			{
				hostProps: {
					isOpen: true,
				},
			},
		);
		let closed = false;
		spectator
			.output("buttonDrawerOnClose")
			.subscribe(() => (closed = true));
		await sleep(100);
		spectator.setHostInput({ isOpen: false });
		await sleep(200);
		expect(closed).toBeTrue();
	});

	it("should add overlay class if backdrop enabled", async () => {
		spectator = createHost(
			`<bottom-drawer [isOpen]="true" [backdrop]="true"></bottom-drawer>`,
		);
		await sleep(100);
		const element = spectator.query("body", { root: true });
		expect(element).toHaveClass("o-overlay--open");
	});

	it("should not add overlay class if backdrop disabled", async () => {
		spectator = createHost(
			`<bottom-drawer [isOpen]="true" [backdrop]="false"></bottom-drawer>`,
		);
		await sleep(100);
		const element = spectator.query("body", { root: true });
		expect(element).not.toHaveClass("o-overlay--open");
	});
});
