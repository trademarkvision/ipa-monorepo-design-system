export type Dictionary<T> = {[k: string]: T};

export type NumberDictionary<T> = {[k: number]: T};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

export interface ToastMessage {
  title?: string;
  message?: string;
  visible?: boolean;
  type?: 'error' | 'info' | 'warning';
  duration?: number;
  id?: number;
  destroy?: boolean;
  hideIcon?: boolean;
  customClass?: string;
  customIcon?: ['far' | 'far' | 'fas', string];
}
