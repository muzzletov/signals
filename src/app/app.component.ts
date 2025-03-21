import {Component, computed, effect, ElementRef, resource, signal, viewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatButton} from "@angular/material/button";
import SampleService from "./sample.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ChildComponent} from "./child.component";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {transform} from "./transform";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSlideToggle, MatButton, ChildComponent, MatInput, MatFormField, MatCheckbox],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('openClose', [
      state('true', style({height: '*'})),
      state('false', style({height: '0', opacity: 0})),
      transition('false <=> true', [animate(500)])
    ])
  ]
})
export class AppComponent {
  model: {
    yolomaster: number; yolomasters: string[], yoloObject: {
      yoloobjectchildarray: string[]
    }
  } = {
    yolomaster: 1,
    yolomasters: [],
    yoloObject: {
      yoloobjectchildarray: []
    }
  }

  classes = ["light", "dark"];
  darkMode = signal(false);
  _log = "";
  get log() {
    return this._log;
  }

  async asyncData() {
    setTimeout(() => SampleService.data.set(["ASYNC ROFL"]), 1000)
  }

  set log(value) {
    this._log = value
    this.logContainer().nativeElement.scrollTo(0, this.logContainer().nativeElement.scrollHeight)
  }

  yolo = resource({
    loader: async () => await new Promise((resolve) => {
      setTimeout(() => {
        console.log("DONE loading resource"), resolve(2)
      }, 4000)
    }),
  });

  childModel = signal(false)
  lol = effect(() => {
    this.log += "effect: wird zu Anfang ausgeführt\n"
  });
  container = viewChild.required<ElementRef>('container');
  logContainer = viewChild.required<ElementRef>('logcontainer');
  signalObject = signal({rofl: 2, active: false})
  size = 0;
  public inputh = ""
  rofl = effect(() => {
    document.body.className = this.classes[0 + (this.darkMode() as unknown as number)]
    this.log += "effect: dark mode\n"
  })

  // animation ist hakelig, da wir schon eingangs die daten kriegen und die obere liste rendern
  computedData = computed(() => {

    if (this.size) {
      const element = this.container().nativeElement;
      element.style.height = element.clientHeight + "px";
      setTimeout(() => {
        element.style.height = element.scrollHeight + "px"
      }, 0)
    }
    this.size = SampleService.data().length;
    this.log += "computed: computedData updated\n"

    return SampleService.data().map(user => `USER: ${user}`)
  })

  constructor() {
    effect(() => {
      // was passiert, wenn man das hier auskommentiert?
      this.childModel()
      this.log += "effect: childModel changed\n"
    })

    effect(() => {
      const masters = this.motol._yolomasters();
      console.log(JSON.stringify(this.motol));
    })

    effect(() => {
      const masters = this.motol.yoloObject._yoloobjectchildarray()
      console.log("act only on sub-array changes");
    })
  }

  destroy() {
    this.rofl.destroy()
    this.log += "darkMode effect destroyed!\n"
  }

  protected readonly SampleService = SampleService;
  protected readonly debounce = debounce.bind(this);

  setInput(event: Event & { target: EventTarget | null }) {
    console.log((<HTMLInputElement>event.target).value)
    this.inputh = (<HTMLInputElement>event.target).value
  }

  motol = transform(this.model);
}

const debounceMap = new Map()

export function debounce(callback: (...args: any[]) => void, ...args: any[]) {
  clearTimeout(debounceMap.get(callback.name))
  console.log("Das hier wird nicht vom Input 'übernommen'. Warum?")
  debounceMap.set(callback.name, setTimeout(callback, 1000, ...args));
}
