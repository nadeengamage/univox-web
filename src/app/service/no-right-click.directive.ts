import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoRightClick]'
})
export class NoRightClickDirective {

    @HostListener('contextmenu', ['$event'])
    onRightClick(event) {
        event.preventDefault();
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        event.preventDefault();
    }

  constructor() { }

}
