import { Directive, ElementRef, OnInit } from '@angular/core';

/**
 * Directive based in https://github.com/ionic-team/ionic/issues/1381
 * with some changes
 */

@Directive({
  selector: '[header-scroller]'
})
export class HeaderScrollerDirective implements OnInit {
  private triggerDistance = 50;
  private el: HTMLElement;
  private lastScrollTop = 0;
  private lastMargin = 0;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  public ngOnInit() {
    const el = this.el;
    const children = el && el.children;
    const childList = children && <Array<HTMLElement>>Array.from(children);

    const scrollList = (childList || []).filter(e => e.classList.contains('scroll-content'));
    const scroll = scrollList.length ? scrollList[0] : null;

    scroll.style.zIndex = '998';
    scroll.style.backgroundColor = 'inherit';

    if (scroll) {
      this.bindScroller(scroll);
    }
  }

  private bindScroller(el: HTMLElement): void {
    el.addEventListener('scroll', event => {
      const scroller = <HTMLElement>event.target;

      const header = <HTMLElement>scroller.parentElement.previousElementSibling;
      const nav = <HTMLElement>scroller.parentElement.previousElementSibling.children[0];

      const scrollTop = scroller.scrollTop;
      const scrollerStyle = scroller.style;

      const navOffset = nav.offsetHeight;
      const headerOffset = header.offsetHeight;

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
