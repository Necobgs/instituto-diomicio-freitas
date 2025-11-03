import { iRoot } from "./iRoot";

export interface iNotification extends iRoot {
    text: string,
    date: Date,
    read: boolean,
}

export type iNotificationForm = Partial<iNotification>;

export interface iPaginationNotification {
  data: iNotification[];
  total: number;
}

export interface iParamsNotification{
    page?: number;
    limit?: number;
    read?: string;
}