import { DateTime } from "luxon";

export interface IClockBlock {
	title: string;
	isLocal?: boolean;
	timeZone: string;
}

export interface InstantiatedClockBlock extends IClockBlock {
	dateTime: DateTime;
}

export interface TClockBlock extends InstantiatedClockBlock {
	close: (arg: string) => void;
}
