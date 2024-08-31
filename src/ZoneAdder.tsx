import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEventHandler, FormEvent, useState } from "react";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import Select from "react-select";
// import { type ITimezone } from "react-timezone-select";

interface Props {
	addToZones: (iana: string, title: string) => void;
}

function ZoneAdder(props: Props) {
	const { addToZones } = props;
	const [show, toggle] = useState(false);
	const [selectedTimezone, setSelectedTimezone] = useState<string>("");

	function setTime(event: FormEvent) {
		event.preventDefault();
		if (!selectedTimezone) {
			toggle(false);
			return;
		}
		toggle(false);
		// @ts-ignore
		const title = event.target.elements[0].value;
		addToZones(selectedTimezone || "", title);
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
			options={getAvailableTimeZones().map((tz) => ({ value: tz, label: tz }))}
		/>
		// <Dropdown zones={getAvailableTimeZones()} />
		// <select id={id} value={value} onChange={onChange}>
		// 	{getAvailableTimeZones().map((tz: string) => (
		// 		<option value={tz}>{tz}</option>
		// 	))}
		// </select>
	);
}

function getAvailableTimeZones(): string[] {
	return Intl.supportedValuesOf("timeZone");
}
