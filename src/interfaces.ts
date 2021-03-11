import { DateTime } from "luxon";

export interface IClockBlock {
    title: string;
    isLocal?: boolean;
    dateTime: DateTime;
    
}

export interface TClockBlock extends IClockBlock {
    close: (arg: DateTime) => void;
}