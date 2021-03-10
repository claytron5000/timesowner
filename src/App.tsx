import React, { useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import "./ZoneAdder.css";
import "bulma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import ZoneAdder from "./ZoneAdder";
import { IClockBlock } from "./interfaces";

function App() {
	const local: IClockBlock = {
		title: "Local",
		dateTime: DateTime.now(),
		isLocal: true
	}
	const [currentZones, setCurrentZones] = useState<Array<IClockBlock>>([local]);
	const [show, toggle] = useState(false);

	useEffect(() => {
		const zoneList = localStorage.getItem("zoneList");
		if(zoneList) {
			setCurrentZones(JSON.parse(zoneList, (key, value)=>{
				if(key === "dateTime") {
					// @todo preserve the iana in setLocal and use that here
					const datetime = DateTime.fromISO(value, {setZone: true});
					return datetime
				}
				return value;
			}))
		}
		
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			
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

		const newtz = { 
			dateTime: DateTime.now().setZone(iana), 
			title
		};
		const zones = currentZones.concat([newtz])
		setCurrentZones(zones);
		toggle(false);
		localStorage.setItem("zoneList", JSON.stringify(zones));
	};

	const sortedZones = [...currentZones].sort((a, b) => a.dateTime.offset - b.dateTime.offset);
	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{fontSize: "2rem"}}>Times Owner</h1>
			</header>
			<main>
				<section className="upper">
					<div>
					<button className="button icon" onClick={() => toggle(!show)}>
						<FontAwesomeIcon icon={faPlus} />
					</button>
					{show ? <ZoneAdder addToZones={addNewZone} /> : null}
					</div>
					<ul className="bar">
						
						{sortedZones.map((clockBlock, index) => (
							<ClockBlock
								key={`${clockBlock.dateTime.zoneName}-${index}`}
								{...clockBlock}
								// close={(clockBlock) => {
								// 	const nextZones = currentZones.filter((zone) => zone.dateTime !== clockBlock )
								// }}
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
	
	const val = dateTime.toFormat("HH:mm:ss");
	
	return (
		<li className="ClockBlock box" style={isLocal ? {background: "#bfefff"}: {}}>
			<h2>{title}</h2>
			<button className="button icon" onClick={() => {}}>
				<FontAwesomeIcon icon={faTimesCircle} />
			</button>
			
			<Clock value={val} renderNumbers={true} />
			<p>{dateTime.zoneName}</p>
		</li>
	);
}

function AddZoneModal(props: { children: React.ReactNode; }) {
	const [show, toggle] = useState(false);

	return (
		<>
			
		</>
	);
}
