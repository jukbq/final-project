import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminActionsComponent } from './admin-actions.component';
import { ActionService } from 'src/app/shared/services/action/action.service';

describe('AdminActionsComponent', () => {
  let component: AdminActionsComponent;
  let fixture: ComponentFixture<AdminActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminActionsComponent],
      providers: [{ provide: ActionService }]
    });
    fixture = TestBed.createComponent(AdminActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
