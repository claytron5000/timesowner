import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useState } from "react";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Select from "react-select";
import { timeZones } from "./timeZones";
import { timeZoneNames } from "./timeZoneNames";

interface Props {
	addToZones: (iana: string, title: string) => boolean;
}

function ZoneAdder(props: Props) {
	const { addToZones } = props;
	const [show, toggle] = useState(false);
	const [selectedTimezone, setSelectedTimezone] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	function setTime(event: FormEvent) {
		event.preventDefault();
		if (!selectedTimezone) {
			toggle(false);
			return;
		}

		// @ts-ignore
		const title = event.target.elements[0].value;
		const set = addToZones(selectedTimezone || "", title);
		if (!set) {
			setMessage("Please chose a title different from your current zones");
			return;
		}
		toggle(false);
		setSelectedTimezone("");
	}

	return (
		<>
			<button className="adder shadow icon" onClick={() => toggle(!show)}>
				<FontAwesomeIcon icon={faPlus} />
			</button>
			<Modal
				isOpen={show}
				style={{
					overlay: {
						backgroundColor: "rgba(10,10,10,0.5)",
					},
					content: {
						right: "30%",
						left: "30%",
						padding: "5rem",
					},
				}}
				onRequestClose={() => {
					toggle(false);
				}}
				shouldCloseOnOverlayClick={true}
				contentLabel="Add a Zone"
				appElement={document.getElementById("root") || undefined}
			>
				<button
					className="closer icon"
					onClick={() => {
						toggle(false);
					}}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
				<form onSubmit={(e) => setTime(e)}>
					<label htmlFor="clock-title">Clock Title</label>
					<input required type="text" name="clock-title" id="clock-title" />
					<label htmlFor="zone-selector">Time Zone</label>
					<TimezoneSelect
						id="zone-selector"
						value={selectedTimezone}
						onChange={(tz: Option | null) => {
							if (tz) {
								setSelectedTimezone(tz.value);
							}
						}}
					/>
					{message}
					{selectedTimezone.indexOf("UTC") > -1 && (
						<>
							<p>
								The zone you're adding is a static offset of{" "}
								{selectedTimezone.slice(3)} hours from UTC. If you're keeping
								track of what time it is in a certain part of the world, this
								may not be the option you want to choose.
							</p>
							<p>
								Instead, find an option that reflects a geographic and political
								space near to where you want to track.
							</p>
							<ZoneHelperList
								offset={selectedTimezone.slice(3)}
								setCallback={setSelectedTimezone}
							/>
						</>
					)}

					<button className="button" style={{ marginTop: "1rem" }}>
						Add it
					</button>
				</form>
			</Modal>
		</>
	);
}

export default ZoneAdder;

type Option = {
	label: string;
	value: string;
};

type ZoneName = {
	"Country code(s)": string;
	"TZ identifier": string;
	"Embedded comments": string;
	Type: string;
	"UTC offset±hh:mm SDT": string;
	"UTC offset±hh:mm DST": string;
	"Time zone abbreviation": string;
	"Source file": string;
	Notes: string;
};

function TimezoneSelect({
	id,
	value,
	onChange,
}: {
	id: string;
	value: string;
	onChange: (it: Option | null) => void;
}) {
	return (
		<Select
			onChange={onChange}
			options={getAvailableTimeZones()}
			value={{ value, label: value }}
		/>
	);
}
type ScrapedTimeZone = {
	Abbr: string;
	Name: string;
	UTCOffset: string;
};
function getAvailableTimeZones(): Option[] {
	//@ts-ignore
	const supportedValues = Intl.supportedValuesOf("timeZone") as string[];
	return supportedValues
		.map((tz) => ({
			value: tz,
			label: tz,
		}))
		.concat(
			timeZones.map((tz: ScrapedTimeZone) => {
				return {
					label: tz.Abbr + "/" + tz.Name,
					value: tz.UTCOffset,
				};
			})
		);
}

function ZoneHelperList({
	offset,
	setCallback,
}: {
	offset: string;
	setCallback: (tz: string) => void;
}) {
	const zoneNames = timeZoneNames.filter((tz) => {
		return (
			tz["UTC offset±hh:mm DST"] === convertToColonSeparated(offset) ||
			tz["UTC offset±hh:mm SDT"] === convertToColonSeparated(offset)
		);
	});
	return (
		<ul className="zoneMap is-multiple">
			{zoneNames.map((zone, index) => (
				<li key={zone["Time zone abbreviation"] + String(index)}>
					<button onClick={() => setCallback(zone["TZ identifier"])}>
						{zone["TZ identifier"]}
					</button>
				</li>
			))}
		</ul>
	);
}

function convertToColonSeparated(offset: string) {
	if (offset[0] !== "-" && offset[0] !== "+") {
		throw new Error("Bad offset: " + offset);
	}
	if (offset.slice(3, -2) === ":") {
		return offset;
	} else {
		return offset + ":00";
	}
}
