export type MenuKey =
  | "desayunos"
  | "comidas"
  | "bebidasCalientes"
  | "bebidasFrias"
  | "postres"
  | "promociones";

export interface MenuConfig {
  key: MenuKey;
  label: string;
  heyzineUrl: string;
}
