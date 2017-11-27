import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolComponentComponent } from './tool-component.component';

describe('ToolComponentComponent', () => {
  let component: ToolComponentComponent;
  let fixture: ComponentFixture<ToolComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
