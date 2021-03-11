import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useState } from "react";
import TimezoneSelect, { TimezoneSelectOption } from "react-timezone-select";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-modal';



interface Props {
	addToZones: (iana: string, title: string) => void;
}

function ZoneAdder(props: Props) {
	const { addToZones } = props;
	const [show, toggle] = useState(false);
	const [selectedTimezone, setSelectedTimezone] = useState<TimezoneSelectOption | string>('')
	
	  
	function setTime(event: FormEvent) {
		event.preventDefault();
		toggle(false);
		// @ts-ignore
		const title = event.target.elements[0].value
		addToZones(typeof selectedTimezone !== "string" ? selectedTimezone.value : '', title);
	}

	return (
		<>
		<button className="button icon" onClick={() => toggle(!show)}>
			<FontAwesomeIcon icon={faPlus} />
		</button>
		<Modal isOpen={show}>
			<form onSubmit={(e) => setTime(e)}>
			<label htmlFor="clock-title">
				Clock Title
				<input type="text" name="clock-title" id="clock-title"/>
			</label>
			<TimezoneSelect
				style={{background: "#4400bb"}}
				value={selectedTimezone}
				onChange={setSelectedTimezone}
			/>
			<button>Add it</button>
			</form>
		</Modal>
		</>
	);
}

export default ZoneAdder;