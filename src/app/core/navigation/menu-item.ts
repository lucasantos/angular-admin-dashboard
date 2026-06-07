import { Type } from "@angular/core";

export type MenuItems = {
  label: string;
  icon: string;
  class?: string;
  route?: string;
  hidden?: boolean;
  subItems?: MenuItems[];
  component?: Type<unknown> | (() => Promise<Type<unknown>>);
  resolve?: { [key: string]: any };
};
