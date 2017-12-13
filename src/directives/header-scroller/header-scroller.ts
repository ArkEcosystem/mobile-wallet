import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Directive based in https://github.com/ionic-team/ionic/issues/1381
 * with some changes
 */

@Directive({
	selector: '[header-scroller]'
})
export class HeaderScrollerDirective implements OnInit {
  private triggerDistance: number = 50;
  private el: HTMLElement;
  private lastScrollTop: number = 0;
  private lastMargin: number = 0;

	constructor(el: ElementRef) {
		this.el = el.nativeElement;
	}

	public ngOnInit() {
		let el = this.el;
		let children = el && el.children;
		let childList = children && <Array<HTMLElement>>Array.from(children);

		let scrollList = (childList || []).filter(e => e.classList.contains('scroll-content'));
    let scroll = scrollList.length ? scrollList[0] : null;

    scroll.style.zIndex = '998';
    scroll.style.backgroundColor = 'inherit';

		if (scroll) {
			this.bindScroller(scroll);
		}
	}

	private bindScroller(el: HTMLElement): void {
		el.addEventListener('scroll', event => {
      let scroller = <HTMLElement>event.target;

      let header = <HTMLElement>scroller.parentElement.previousElementSibling;
      let nav = <HTMLElement>scroller.parentElement.previousElementSibling.children[0];

      let scrollTop = scroller.scrollTop;
      let scrollerStyle = scroller.style;

      let navOffset = nav.offsetHeight;
      let headerOffset = header.offsetHeight;

      let newMargin;
      let newPadding;

      if (scrollTop > this.lastScrollTop && scrollTop > this.triggerDistance) {
        newMargin = (this.lastMargin || headerOffset) - (scrollTop - this.lastScrollTop);
        if (newMargin <= navOffset) {
          newMargin = navOffset;
        }
      } else if (scrollTop < this.lastScrollTop) {
        newMargin = (this.lastMargin || headerOffset) + (this.lastScrollTop - scrollTop);
        if (newMargin >= headerOffset) {
          newMargin = headerOffset;
        }
      }
      if (newMargin) {
        newPadding = headerOffset - newMargin;
      }

      scrollerStyle.marginTop = `${newMargin}px`;
      scrollerStyle.paddingTop = `${newPadding}px`;
      this.lastScrollTop = scrollTop;
      this.lastMargin = newMargin;
		});
	}
}
