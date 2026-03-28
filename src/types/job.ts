import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iJob extends iRoot{
    name: string;
}

export interface iPaginationJob extends iPagination {
  data: iJob[];
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

export type iJobForm = Partial<iJob>;