import { DateTime } from "luxon";

export interface IClockBlock {
	title: string;
	isLocal?: boolean;
	timeZone: string;
}

export interface InstatiatedClockBlock extends IClockBlock {
	dateTime: DateTime;
}

export interface TClockBlock extends InstatiatedClockBlock {
	close: (arg: string) => void;
}
