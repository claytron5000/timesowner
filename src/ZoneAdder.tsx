import { useState } from "react";
import Downshift from "downshift";
import { zones as zoneList } from "tzdata";
import { DateTime } from "luxon";

interface Props {
	addToZones: (iana: string, title: string) => void;
}

function ZoneAdder(props: Props) {
	const { addToZones } = props;
	const [input, setInput] = useState("");

	const luxonValidTimezones = Object.entries(zoneList)
		.filter(([zoneName, v]) => Array.isArray(v))
		.map(([zoneName, v]) => zoneName)
		.filter((tz) => DateTime.local().setZone(tz).isValid);

	return (
		<Downshift
			onChange={(selection) => {
				addToZones(selection, "Title");
				setInput("");
			}}
			itemToString={(item) => (item ? item : "")}
			inputValue={input}
		>
			{({
				getInputProps,
				getItemProps,
				getLabelProps,
				getMenuProps,
				isOpen,
				inputValue,
				highlightedIndex,
				selectedItem,
				getRootProps,
			}) => (
				<div className={"ZoneAdder"}>
					<label {...getLabelProps()}>Add a TimeZone</label>
					<div
						style={{ display: "inline-block" }}
						{...getRootProps({refKey: "key"}, { suppressRefError: true })}
					>
						<input
							{...getInputProps()}
							onInput={(e) => setInput((e.target as HTMLInputElement).value)}
						/>
					</div>
					<ul {...getMenuProps()}>
						{isOpen
							? luxonValidTimezones
									.filter((zone) => !inputValue || zone.includes(inputValue))
									.map((zone, index) => (
										<li
											{...getItemProps({
												key: zone,
												index,
												item: zone,
												style: {
													backgroundColor:
														highlightedIndex === index
															? "lightgray"
															: "transparent",
													fontWeight: selectedItem === zone ? "bold" : "normal",
												},
											})}
										>
											{zone}
										</li>
									))
							: null}
					</ul>
				</div>
			)}
		</Downshift>
	);
}

export default ZoneAdder;