import { DateTime } from "luxon";

export interface IClockBlock {
    title: string;
    isLocal?: boolean
    dateTime: DateTime
}