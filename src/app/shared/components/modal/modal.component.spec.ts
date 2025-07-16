import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { EventEmitter } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('title has value', () => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.title = 'Title modal'
    expect(component.title).toEqual('Title modal');
  });

  it('should emit "closed" event with "false" when close(false) is called', () => {
    spyOn(component.closed, 'emit');

    component.close(false);

    expect(component.closed.emit).toHaveBeenCalledWith(false);
  });


});
