import React, { useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import "./ZoneAdder.css";
import "bulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import Modal from "react-modal";
import ZoneAdder from "./ZoneAdder";
import { IClockBlock } from "./interfaces";

function App() {
	const local: IClockBlock = {
		title: "Local",
		dateTime: DateTime.now(),
		isLocal: true
	}
	const [currentZones, setCurrentZones] = useState<Array<IClockBlock>>([local]);

	useEffect(() => {
		const interval = setInterval(() => {
			// debugger	
			const nextZones = currentZones.map((clockBlock) => {
				const now = DateTime.now();
				const newZone = now.setZone(clockBlock.dateTime.zoneName);
				return {...clockBlock, dateTime: newZone};
			});
			setCurrentZones(nextZones);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [currentZones]);

	const addNewZone = (iana: string, title: string) => {
		// debugger
		const newtz = { 
			dateTime: DateTime.now().setZone(iana), 
			title
		};
		setCurrentZones(currentZones.concat([newtz]));
	};

	const sortedZones = [...currentZones].sort((a, b) => a.dateTime.offset - b.dateTime.offset);
	// debugger
	return (
		<div className="App">
			<header className="App-header">
				<h1>Times Owner</h1>
			</header>
			<main>
				<section className="upper">
				<AddZoneModal>
							<ZoneAdder addToZones={addNewZone} />
						</AddZoneModal>
					<ul className="bar">
						
						{sortedZones.map((clockBlock, index) => (
							<ClockBlock
								key={`${clockBlock.dateTime.zoneName}-${index}`}
								{...clockBlock}
							/>
						))}
					</ul>
				</section>
			</main>
		</div>
	);
}

export default App;

function ClockBlock(props: IClockBlock) {
	const { dateTime, title, isLocal } = props;
	return (
		<li className="ClockBlock box" style={isLocal ? {background: "#bfefff"}: {}}>
			<h2>{title}</h2>
			<Clock value={dateTime.toFormat("HH:mm:ss")} renderNumbers={true} />
			<p>{dateTime.zoneName}</p>
		</li>
	);
}

function AddZoneModal(props: { children: React.ReactNode; }) {
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
