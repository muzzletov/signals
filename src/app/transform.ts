import {signal, Signal} from "@angular/core";

export type Extended<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
} & {
  [K in keyof T as `_${K & string}`]: Signal<T[K]>;
};

export function transform<T extends Record<string, any>>(obj: T): Extended<T> {
  const extendedObj: Partial<Extended<T>> = {};

  for (const key in obj) {
    if(!obj[key]) continue;

    if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "object") {
      let currentValue = obj[key];

      const valueSignal = signal<typeof currentValue>(currentValue);

      Object.defineProperty(extendedObj, key, {
        get() {
          return currentValue;
        },
        set(newValue: typeof currentValue) {
          valueSignal.set(currentValue);
          currentValue = newValue;
        },
        enumerable: true,
        configurable: true,
      });

      Object.defineProperty(extendedObj, `_${key}` as keyof Extended<T>, {
        get() {
          return valueSignal;
        },
        enumerable: false,
        configurable: false,
      });


      const isArray = Array.isArray(obj[key])

      if(!isArray) transform(obj[key])
    }
  }

  return extendedObj as Extended<T>;
}
