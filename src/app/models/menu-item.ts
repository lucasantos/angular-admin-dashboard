export type MenuItems = {
  label: string;
  icon: string;
  class?: string;
  route?: string;
  subItems?: MenuItems[];
};
