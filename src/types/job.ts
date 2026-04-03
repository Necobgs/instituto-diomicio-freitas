import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iJob extends iRoot{
    name: string;
}

export type iJobForm = Partial<iJob>;

export interface iPaginationJob extends iPagination {
  data: iJobForm[];
}

export interface iParamsJob {
    page?: number;
    limit?: number;
    name?: string;
    enabled?: string;
}

export interface iJobState extends iState {
    jobs: iJob[];
}