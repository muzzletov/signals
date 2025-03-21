import {Component, input, model} from "@angular/core";
import {MatButton} from "@angular/material/button";


@Component(
  {
    selector: 'child',
    template: `
      <div style="display: flex; flex-direction: column; row-gap: 1rem">
        <button (click)="do()">ITSA ME!</button>
        <button (click)="doInstead()">ITSA YOU!</button>
        <div>
          <button mat-raised-button color="primary" (click)="childModel.set(!childModel())">propagate childModel
          </button>
        </div>
        <div><b>Inputh:</b> "{{ inputh() }}"
        </div>
      </div>`,
    imports: [
      MatButton
    ],
    standalone: true
  })
export class ChildComponent {
  yolo = input<{ yolomaster: number; yolomasters: string[],yoloObject: {
      yoloobjectchildarray: string[]
    } }>()
  inputh = input("lol")
  childModel = model(false);

  do() {
    this.yolo()!.yolomasters = [...this.yolo()!.yolomasters, "ME!", "MARIO!"]
  }

  doInstead() {
    this.yolo()!.yoloObject.yoloobjectchildarray = [...this.yolo()!.yoloObject.yoloobjectchildarray, "ME!", "LUIGI!"]
  }
}
