import {Component, input, model} from "@angular/core";
import {MatButton} from "@angular/material/button";


@Component(
  {
    selector: 'child',
    template: `
      <div style="display: flex; flex-direction: column; row-gap: 1rem">
        <div>
          <button mat-raised-button color="primary" (click)="childModel.set(!childModel())">propagate childModel
          </button>
        </div>
        <div><b>Inputh:</b> "{{inputh()}}"
        </div>
      </div>`,
    imports: [
      MatButton
    ],
    standalone: true
  })
export class ChildComponent {
  inputh = input("lol")
  childModel = model(false);
}
