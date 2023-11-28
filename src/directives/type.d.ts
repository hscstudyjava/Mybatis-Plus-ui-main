// types.ts
import type { Directive } from 'vue';
type EventTypes = 'click' | 'input';

export interface ELType extends HTMLElement {
  __fn__: () => any;
}

export interface Directives {
    vPeri:Directive,// 按钮权限
    vRole:Directive,// 角色权限
    vCopy:Directive,// 复制内容
}

export type Keys = keyof Directives;

// 指令名转小写
type LowerDirectiveName<T extends Keys> = T extends `v${infer V}`
  ? Lowercase<V>
  : never;

// 指令对象类型
export interface DirectiveOptions<T extends Keys> {
  name: LowerDirectiveName<T>;
  directive: Directives[T];
}

