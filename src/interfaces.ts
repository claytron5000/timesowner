import { DateTime } from "luxon";

export interface IClockBlock extends DateTime {
    title: string;
    isLocal?: boolean
}