import { iActionForm } from "./action";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iResourceForm } from "./resource";
import { iState } from "./state";

export interface iPermission extends iRoot {
    resource: iResourceForm;
    action: iActionForm;
}

export type iPermissionForm = Partial<iPermission>;

export interface iPaginationPermission extends iPagination {
  data: iPermissionForm[];
}

export interface iParamsPermission {
    page?: number;
    limit?: number;
}

export interface iPermissionState extends iState {
    permissions: iPermissionForm[];
    permission: iPermissionForm | null;
}