import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionResponse } from 'src/app/shared/interfaces/action';
import { ActionService } from 'src/app/shared/services/action/action.service';

@Component({
  selector: 'app-action-info',
  templateUrl: './action-info.component.html',
  styleUrls: ['./action-info.component.css'],
})
export class ActionInfoComponent {
  public actionData: ActionResponse | undefined;
  public action = 'Бонусна програма';

  constructor(
    private actionService: ActionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const actionParam = this.route.snapshot.paramMap.get('id');
    console.log(actionParam);
    if (actionParam !== null) {
      this.action = actionParam;
      this.getAction();
    } 
  }

  getAction() {
    if (this.action !== 'Бонусна програма')
      this.actionService.getOneAction(this.action).subscribe((data) => {
        this.actionData = data as ActionResponse;
        this.action = this.actionData.title
        console.log(this.actionData);
              });
console.log(this.action);
  }
}
