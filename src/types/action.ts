import { iRoot } from "./iRoot";

export interface iAction extends iRoot {
    name: string;
    indentifier: string;
}

export type iActionForm = Partial<iAction>;