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
import { IClockBlock, TClockBlock } from "./interfaces";

function App() {
	const local: IClockBlock = {
		title: "Local",
		dateTime: DateTime.now(),
		isLocal: true
	}
	const [currentZones, setCurrentZones] = useState<Array<IClockBlock>>([local]);

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
		debugger
		setCurrentZones(zones);
		
		localStorage.setItem("zoneList", JSON.stringify(zones));
	};

	const removeZone = (clockBlock:DateTime) => {
		const nextZones = currentZones.filter((zone) => zone.dateTime !== clockBlock)
		setCurrentZones(nextZones);
		localStorage.setItem("zoneList", JSON.stringify(nextZones))
	}

	const sortedZones = [...currentZones].sort((a, b) => a.dateTime.offset - b.dateTime.offset);
	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{fontSize: "2rem"}}>Times Owner</h1>
			</header>
			<main>
				<section className="upper">					
					<ZoneAdder addToZones={addNewZone} />
					<ul className="bar">
						
						{sortedZones.map((clockBlock, index) => (
							<ClockBlock
								key={`${clockBlock.dateTime.zoneName}-${index}`}
								{...clockBlock}
								close={removeZone}
							/>
						))}
					</ul>
				</section>
				<hr/>
				<section></section>
			</main>
		</div>
	);
}

export default App;

function ClockBlock(props: TClockBlock) {
	const { dateTime, title, isLocal, close } = props;
	
	const val = dateTime.toFormat("HH:mm:ss");
	
	return (
		<li className="ClockBlock box" style={isLocal ? {background: "#bfefff"}: {}}>
			<header><h2>{title}</h2>
			{!isLocal && <button className="button icon" onClick={() => {close(dateTime)}}>
				<FontAwesomeIcon icon={faTimesCircle} />
			</button>}
			</header>
			
			<Clock value={val} renderNumbers={true} />
			<p>{dateTime.zoneName}</p>
		</li>
	);
}
