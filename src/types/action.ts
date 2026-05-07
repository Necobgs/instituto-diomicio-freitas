import { iRoot } from "./iRoot";

export interface iAction extends iRoot {
    name: string;
    identifier: string;
}

export type iActionForm = Partial<iAction>;