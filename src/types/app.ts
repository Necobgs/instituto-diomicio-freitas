import { iState } from "./state";

export interface iAppState extends iState {
    isFetched: boolean;
}

export interface iDefaultResponse {
    message: string;
}