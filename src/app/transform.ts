import { signal, WritableSignal } from '@angular/core';

export type Reactive<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any> ? Reactive<T[K]> : T[K];
} & {
  [K in keyof T as `$${K & string}`]: WritableSignal<
    T[K] extends Record<string, any> ? Reactive<T[K]> : T[K]
  >;
};

export function transform<T extends Record<string, any>>(obj: T): Reactive<T> {
  if (obj === null || typeof obj !== 'object') return obj;

  const extendedObj: Partial<Reactive<T>> = {};
  const isArray = Array.isArray(obj);

  if (isArray) return obj;

  for (const key in obj) {
    const hasProperty = Object.prototype.hasOwnProperty.call(obj, key);

    if (!hasProperty) {
      continue;
    }

    let currentValue = transform(obj[key]);

    const valueSignal = signal(Symbol());

    Object.defineProperty(extendedObj, key, {
      get() {
        return currentValue;
      },
      set(newValue: typeof currentValue) {
        valueSignal.set(Symbol());
        if (newValue !== currentValue) {
          currentValue = transform(newValue);
        }
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(extendedObj, `$${key}` as keyof Reactive<T>, {
      get() {
        return valueSignal;
      },
      enumerable: false,
      configurable: false,
    });
  }

  return extendedObj as Reactive<T>;
}

export function reactive<T extends Record<string, any>>(initial: T) {
  const valueSignal = signal(Symbol());

  let currentValue = transform(initial);

  const obj = {
    get value() {
      return currentValue;
    },
    set value(newValue: typeof currentValue) {
      valueSignal.set(Symbol());
      if (newValue !== currentValue) {
        currentValue = transform({ ...initial, ...(newValue ?? {}) });
      }
    },
  };

  Object.defineProperty(obj, '$value', {
    get() {
      return valueSignal;
    },
    enumerable: false,
    configurable: false,
  });

  return obj as Reactive<{ value: T }>;
}
