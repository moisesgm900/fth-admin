import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsvoluntersComponent } from './docsvolunters.component';

describe('DocsvoluntersComponent', () => {
  let component: DocsvoluntersComponent;
  let fixture: ComponentFixture<DocsvoluntersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsvoluntersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocsvoluntersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
