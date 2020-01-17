import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedModule } from "@/app/shared.module";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { IntroPage } from "./intro";

describe("IntroPage", () => {
	let component: IntroPage;
	let fixture: ComponentFixture<IntroPage>;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			declarations: [IntroPage],
			imports: [
				IonicModule,
				IonicStorageModule.forRoot(),
				TranslateModule.forRoot(),
				SharedModule,
				RouterModule.forRoot([]),
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(IntroPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
