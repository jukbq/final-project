import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionResponse } from 'src/app/shared/interfaces/action';
import { ActionService } from 'src/app/shared/services/action/action.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
})
export class ActionsComponent {
  public actions: Array<ActionResponse> = [];
  public actionName = '';

  constructor(
    private actionService: ActionService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.getActions();
  }

  getActions(): void {
    this.actionService.getAll().subscribe((data) => {
      this.actions = data;
    });
  }

  actionInfo(action: any): void {
    if (action !== 'Бонусна програма') {
      this.actionName = action.id;
      this.router.navigate(['/action-info', { id: this.actionName }]);
       this.viewportScroller.scrollToPosition([0, 0]);
    } else {
      this.actionName = action;
      this.router.navigate(['/action-info', { id: this.actionName }]);
       this.viewportScroller.scrollToPosition([0, 0]);
    }
  }
}
