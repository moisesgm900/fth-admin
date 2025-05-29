import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesPuestosComponent } from './perfiles-puestos.component';

describe('PerfilesPuestosComponent', () => {
  let component: PerfilesPuestosComponent;
  let fixture: ComponentFixture<PerfilesPuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesPuestosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilesPuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
