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
import { ClockBlockClass } from "./ClockBlockClass";

function App() {
	
	const [currentZones, setCurrentZones] = useState<Array<ClockBlockClass>>([new ClockBlockClass({title: "Local", isLocal: true})]);

	useEffect(() => {
		const interval = setInterval(() => {
			const nextZones = currentZones.map((clockBlock) => {
				const now = new ClockBlockClass({title:clockBlock.title, isLocal: clockBlock.isLocal})
				now.setZone(clockBlock.zoneName);
				return now;
			});
			
			setCurrentZones(nextZones);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [currentZones]);

	const addNewZone = (iana: string, title: string) => {
		
		const newtz = new ClockBlockClass({title});
		newtz.setZone(iana);
		setCurrentZones(currentZones.concat([newtz]));
	};

	const sortedZones = [...currentZones].sort((a, b) => a.offset - b.offset);
	// debugger
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
						{sortedZones.map((clockBlock: ClockBlockClass, index) => (
							<ClockBlock
								key={`${clockBlock.zoneName}-${index}`}
								cb={clockBlock}
							/>
						))}
					</ul>
				</section>
			</main>
		</div>
	);
}

export default App;

function ClockBlock(props: {cb: ClockBlockClass}) {
	const { title, isLocal } = props.cb;
	return (
		<li className="ClockBlock box" style={isLocal ? {background: "#bfefff"}: {}}>
			<h2>{title}</h2>
			<Clock value={props.cb.toFormat("HH:mm:ss")} renderNumbers={true} />
			<p>{props.cb.zoneName}</p>
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
