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
	private transition: number = 0.5;
  private el: HTMLElement;
  private lastScrollTop: number = 0;

	constructor(el: ElementRef) {
		this.el = el.nativeElement;
	}

	public ngOnInit() {
		let el = this.el;
		let children = el && el.children;
		let childList = children && <Array<HTMLElement>>Array.from(children);

		let scrollList = (childList || []).filter(e => e.classList.contains('scroll-content'));
    let scroll = scrollList.length ? scrollList[0] : null;

    // Set animation transition
    scroll.style.transition = `margin ${this.transition}s linear`;
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
      if (scrollTop > this.lastScrollTop && scrollTop >= this.triggerDistance) {
        newMargin = navOffset;
      } else if (scrollTop < this.lastScrollTop && scrollTop <= this.triggerDistance) {
        newMargin = headerOffset;
        scroller.scrollTop = 0;
      }

      scrollerStyle.marginTop = `${newMargin}px`;
      this.lastScrollTop = scrollTop;
		});
	}
}
