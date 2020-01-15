import {  Directive,  Input,  HostListener} from "@angular/core";
import {NotifyService} from "../core/notify.service";

@Directive({
  selector: '[text-copy]'
})
export class TextCopyDirective {
  @Input('text-copy') text:string;

  constructor(private notify: NotifyService,) {
  }

  @HostListener('click') copyText() {

    const textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '-999px';
    textArea.style.left = '-999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = this.text;
    document.body.appendChild(textArea);

    textArea.select();

    try {
      document.execCommand('copy');
      this.notify.update('It was copied to the clipboard', 'success');
    } catch (err) {
      this.notify.update('Unable to copy', 'error');
    }

    document.body.removeChild(textArea);
  }
}
