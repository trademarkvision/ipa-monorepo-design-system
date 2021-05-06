export interface KeydownOptions {
  key: string,
  altKey?: boolean,
  ctrlKey?: boolean,
  shiftKey?: boolean
}

export default function Keydown(options: KeydownOptions) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        e.key === options.key &&
        (options.altKey !== undefined ? e.altKey === options.altKey : true) &&
        (options.ctrlKey !== undefined ? e.ctrlKey === options.ctrlKey : true) &&
        (options.shiftKey !== undefined ? e.shiftKey === options.shiftKey : true)
      ) {
        descriptor.value.apply(target)
      }
    });
  }
}
