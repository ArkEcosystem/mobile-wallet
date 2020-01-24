import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	exports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
})
export class SharedModule {}
