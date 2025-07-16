import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() title!: string;
  @Input() showBtnCancel = true;
  @Output() closed = new EventEmitter<boolean>();

  close(ok: boolean) {
    this.closed.emit(ok);
  }
}
