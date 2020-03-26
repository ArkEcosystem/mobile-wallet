import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "escapeHTML",
})
export class EscapeHTMLPipe implements PipeTransform {
	transform(htmlString: string): string {
		if (!htmlString) {
			return htmlString;
		}
		return htmlString.replace(/[&"<>]/g, (c) => {
			return {
				"&": "&amp;",
				'"': "&quot;",
				"<": "&lt;",
				">": "&gt;",
			}[c];
		});
	}
}
