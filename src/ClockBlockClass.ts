import { DateTime } from "luxon";

export class ClockBlockClass extends DateTime{
    title: string;
    isLocal: boolean | undefined;
    constructor(props:{title: string, isLocal?: boolean}) {
        super({});
        this.title = props.title;
        this.isLocal = props.isLocal;
    }
   
}