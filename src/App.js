import React, { useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import "./ZoneAdder.css";
// import "normalize.css";
import "bulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import Downshift from "downshift";
import { zones as zoneList } from "tzdata";
import Modal from "react-modal";

function App() {
	const [currentZones, setCurrentZones] = useState([DateTime.now()]);

	useEffect(() => {
		const interval = setInterval(() => {
			const nextZones = currentZones.map((zone) => {
				const now = DateTime.now();
				return now.setZone(zone.zoneName);
			});
			setCurrentZones(nextZones);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [currentZones]);

	const addNewZone = (iana) => {
		const newtz = DateTime.now().setZone(iana);
		setCurrentZones(currentZones.concat([newtz]));
	};

	const sortedZones = [...currentZones].sort((a, b) => a.offset - b.offset);
	return (
		<div className="App">
			<header className="App-header">
				<h1>Times Owner</h1>
			</header>
			<main>
				<section>
					<ul className="bar">
						<AddZoneModal>
							<ZoneAdder addToZones={addNewZone} />
						</AddZoneModal>
						{sortedZones.map((dateTime, index) => (
							<ClockBlock
								key={`${dateTime.zoneName}-${index}`}
								value={dateTime}
								location={dateTime.zoneName}
							/>
						))}
					</ul>
				</section>
			</main>
		</div>
	);
}

export default App;

function ClockBlock({ value, location }) {
	return (
		<li className="ClockBlock box">
			<Clock value={value.toFormat("HH:mm:ss")} renderNumbers={true} />
			<p>{location}</p>
		</li>
	);
}

function ZoneAdder({ addToZones, handleChange }) {
	const [input, setInput] = useState("");

	const luxonValidTimezones = Object.entries(zoneList)
		.filter(([zoneName, v]) => Array.isArray(v))
		.map(([zoneName, v]) => zoneName)
		.filter((tz) => DateTime.local().setZone(tz).isValid);

	return (
		<Downshift
			onChange={(selection) => {
				addToZones(selection);
				setInput("");
				// handleChange();
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
						{...getRootProps({}, { suppressRefError: true })}
					>
						<input
							{...getInputProps()}
							onInput={(e) => setInput(e.target.value)}
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

function AddZoneModal(props) {
	const [show, toggle] = useState(false);

	return (
		<>
			<button className="button icon" onClick={() => toggle(!show)}>
				<FontAwesomeIcon icon={faPlus} />
			</button>
			<Modal
				isOpen={show}
				contentLabel="Add a new Time Zone"
				ariaHideApp={false}
			>
				<button className="delete" onClick={() => toggle(!show)}>
					x
				</button>
				{props.children}
			</Modal>
		</>
	);
}
