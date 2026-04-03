import { iRoot } from "./iRoot";

export interface iResource extends iRoot {
    name: string;
    identifier: string;
}

export type iResourceForm = Partial<iResource>;