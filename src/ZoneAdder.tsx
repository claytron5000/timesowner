import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FormEvent, useState } from "react";
import TimezoneSelect, { TimezoneSelectOption } from "react-timezone-select";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
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
		if(!selectedTimezone) {
			toggle(false);
			return;
		}
		toggle(false);
		// @ts-ignore
		const title = event.target.elements[0].value
		addToZones(typeof selectedTimezone !== "string" ? selectedTimezone.value : '', title);
		setSelectedTimezone("");
	}

	return (
		<>
		<button className="adder shadow icon" onClick={() => toggle(!show)}>
			<FontAwesomeIcon icon={faPlus} />
		</button>
		<Modal isOpen={show} style={{
              overlay: {
                backgroundColor: 'rgba(10,10,10,0.5)'
              },
              content: {
                right: "30%",
				left: "30%",
				padding: "5rem"
              }
            }}>
			<button className="closer icon" onClick={() => {toggle(false)}}>
				<FontAwesomeIcon icon={faTimesCircle} />
			</button>
			<form onSubmit={(e) => setTime(e)}>
			<label htmlFor="clock-title">Clock Title</label>
			<input required type="text" name="clock-title" id="clock-title"/>
			<label htmlFor="zone-selector">Time Zone</label>
			<TimezoneSelect
				id="zone-selector"
				required={true}
				style={{background: "#4400bb"}}
				value={selectedTimezone}
				onChange={setSelectedTimezone}
			/>
			
			<button className="button" style={{marginTop: "1rem"}}>Add it</button>
			</form>
		</Modal>
		</>
	);
}

export default ZoneAdder;