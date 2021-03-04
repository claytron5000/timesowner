import React, { useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import Downshift from "downshift";
import { zones as zoneList } from "tzdata";

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
				<ZoneAdder addToZones={addNewZone} />
				<section className="bar">
					{sortedZones.map((dateTime, index) => (
						<ClockBlock
							key={`${dateTime.zoneName}-${index}`}
							value={dateTime}
							location={dateTime.zoneName}
						/>
					))}
				</section>
			</main>
		</div>
	);
}

export default App;

function ClockBlock({ value, location }) {
	return (
		<div className="ClockBlock">
			<Clock value={value.toFormat("HH:mm:ss")} />
			<p>{location}</p>
		</div>
	);
}

function ZoneAdder({ addToZones }) {
	const luxonValidTimezones = Object.entries(zoneList)
		.filter(([zoneName, v]) => Array.isArray(v))
		.map(([zoneName, v]) => zoneName)
		.filter((tz) => DateTime.local().setZone(tz).isValid);

	return (
		<Downshift
			onChange={(selection) => addToZones(selection)}
			itemToString={(item) => (item ? item : "")}
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
				<div>
					<label {...getLabelProps()}>Add a TimeZone</label>
					<div
						style={{ display: "inline-block" }}
						{...getRootProps({}, { suppressRefError: true })}
					>
						<input {...getInputProps()} />
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
														highlightedIndex === index ? "lightgray" : "white",
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
