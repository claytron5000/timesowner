export interface IClockBlock {
	title: string;
	isLocal?: boolean;
	timeZone: string;
}

export interface TClockBlock extends IClockBlock {
	close: (arg: string) => void;
}
