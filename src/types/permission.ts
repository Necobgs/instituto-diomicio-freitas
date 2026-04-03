import { iActionForm } from "./action";
import { iRoot } from "./iRoot";
import { iResourceForm } from "./resource";

export interface iPermission extends iRoot {
    resource: iResourceForm;
    action: iActionForm;
}

export type iPermissionForm = Partial<iPermission>;