import React, { useState } from "react";
import TimezoneSelect, { TimezoneSelectOption } from "react-timezone-select";

interface Props {
	addToZones: (iana: string, title: string) => void;
}

function ZoneAdder(props: Props) {
	const { addToZones } = props;
	const [selectedTimezone, setSelectedTimezone] = useState<TimezoneSelectOption | string>('')
	
	  
	function setTime(zone: TimezoneSelectOption) {
		setSelectedTimezone(zone);
		addToZones(zone.value, zone.altName || "");
	}

	return (
		<div style={{position: "absolute", width: "24rem", zIndex:1,  background: "white"}}>
			<TimezoneSelect
				style={{background: "#4400bb"}}
				value={selectedTimezone}
				onChange={setTime}
			/>
		</div>
	);
}

export default ZoneAdder;