import { Directive, ElementRef, OnInit, Input, Renderer2, AfterViewInit } from "@angular/core";
import { IonContent, DomController } from "@ionic/angular";

/**
 * Directive based in https://github.com/yalzeee/Ionic-4-Press-and-Hold-Gallery
 * with some changes
 */

@Directive({
  selector: "[header-scroller]"
})
export class HeaderScrollerDirective implements OnInit {
  @Input("header-scroller")
  private content: IonContent;

  private isHidden = false;
  private triggerDistance = 50;
  private contentHeight = 200;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.initStyles();
    this.content.ionScroll.subscribe((scrollEvent: CustomEvent) => {
      const currentY = scrollEvent.detail.currentY;

      if (currentY === 0 && this.isHidden) {
        this.show();
      } else if (!this.isHidden && currentY > this.triggerDistance) {
        this.hide();
      } else if (this.isHidden && currentY < this.triggerDistance * -1) {
        this.show();
      }
    });
  }

  initStyles() {
    setTimeout(() => {
      this.contentHeight = this.element.nativeElement.offsetHeight;
    }, 0);
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "min-height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "height", "0px");
      this.renderer.setStyle(this.element.nativeElement, "opacity", "0");
      this.renderer.setStyle(this.element.nativeElement, "padding", "0");
    });

    this.isHidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "height", this.contentHeight + "px");
      this.renderer.removeStyle(this.element.nativeElement, "min-height");
      this.renderer.removeStyle(this.element.nativeElement, "opacity");
      this.renderer.removeStyle(this.element.nativeElement, "padding");
    });

    this.isHidden = false;
  }
}
