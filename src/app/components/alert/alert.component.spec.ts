import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { sleep } from "@@/test/helpers";

import { Alert } from "./alert.component";

describe("Alert component", () => {
	let spectator: SpectatorHost<Alert>;
	const createHost = createHostFactory({
		component: Alert,
		imports: [IonicModule.forRoot()],
	});

	it("should render a success alert", async () => {
		spectator = createHost(
			`<alert-component status=true title="success" message="message"></alert-component>`,
		);
		await sleep(100);
		const root = spectator.query(byTestId("alert-box"));
		const title = root.querySelector(".text-xl");
		const message = root.querySelector("span");
		const img = root.querySelector("img.status-success");

		expect(title.innerHTML.trim()).toEqual("success");
		expect(message.innerHTML).toEqual("message");
		expect(img).not.toEqual(null);
	});

	it("should render a error alert", async () => {
		spectator = createHost(
			`<alert-component title="error" message="message"></alert-component>`,
		);
		await sleep(100);
		const root = spectator.query(byTestId("alert-box"));
		const title = root.querySelector(".text-xl");
		const message = root.querySelector("span");
		const img = root.querySelector("img.status-error");

		expect(title.innerHTML.trim()).toEqual("error");
		expect(message.innerHTML).toEqual("message");
		expect(img).not.toEqual(null);
	});
});
