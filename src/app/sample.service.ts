import {signal, WritableSignal} from "@angular/core";

export default class SampleService {
  static data: WritableSignal<string[]> = signal([])

  static async fetchData() {
    this.data.set([...this.data(), "ROFL", "LOL"])
  }

  static async fetchDataAsSignal() {
    this.data.set(["ROFL", "LOL"])
    return this.data;
  }
}
