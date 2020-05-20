import { Component, Input } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
	selector: "password-page",
	templateUrl: "password-page.component.html",
	styleUrls: ["password-page.component.scss"],
})
export class PasswordPageComponent {
	@Input()
	public words: Array<string> = [];

	constructor(private navCtrl: NavController) {}

	handleNextAction() {
		this.navCtrl.navigateForward("/password/check");
	}
}
