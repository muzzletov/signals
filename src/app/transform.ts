import {signal, Signal} from "@angular/core";

type Extended<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? Extended<T[K]>
    : T[K];
} & {
  [K in keyof T as `_${K & string}`]: Signal<T[K] extends Record<string, any>
    ? Extended<T[K]>
    : T[K]>;
};

export function transform<T extends Record<string, any>>(obj: T): Extended<T> {
  const extendedObj: Partial<Extended<T>> = {};
  const isArray = Array.isArray(obj)

  if (isArray) return obj;

  for (const key in obj) {
    if (!obj[key]) continue;

    if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "object") {
      let currentValue = transform(obj[key]);

      const valueSignal = signal<typeof currentValue>(currentValue);

      Object.defineProperty(extendedObj, key, {
        get() {
          return currentValue;
        },
        set(newValue: typeof currentValue) {
          valueSignal.set(currentValue);
          currentValue = transform(newValue);
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
    }
  }

  return extendedObj as Extended<T>;
}
