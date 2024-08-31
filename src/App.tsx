import React, { useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import "./ZoneAdder.css";
import "bulma/css/bulma.css";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import ZoneAdder from "./ZoneAdder";
import { IClockBlock } from "./interfaces";
import { type ITimezone } from "react-timezone-select";
import { ClockBlock } from "./ClockBlock";

function App() {
	const local: IClockBlock = {
		title: "Local",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		isLocal: true,
	};
	const [currentZones, setCurrentZones] = useState<Array<IClockBlock>>([local]);

	useEffect(() => {
		const zoneList = localStorage.getItem("zoneList3");
		if (zoneList) {
			setCurrentZones(
				JSON.parse(zoneList, (key, value) => {
					if (key === "dateTime") {
						// @todo preserve the iana in setLocal and use that here
						const datetime = DateTime.fromISO(value, { setZone: true });
						return datetime;
					}
					return value;
				})
			);
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			const nextZones = currentZones.map((clockBlock: IClockBlock) => {
				const now = DateTime.now();
				const newZone = now.setZone(clockBlock.timeZone);
				return { ...clockBlock, dateTime: newZone };
			});
			setCurrentZones(nextZones);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [currentZones]);

	const addNewZone = (iana: string, title: string) => {
		const newtz: IClockBlock = {
			timeZone: iana, //DateTime.now().setZone(iana.toString()),
			title,
		};
		const zones = currentZones.concat([newtz]);
		setCurrentZones(zones);

		localStorage.setItem("zoneList3", JSON.stringify(zones));
	};

	const removeZone = (clockBlock: string) => {
		const nextZones = currentZones.filter(
			(zone) => zone.timeZone !== clockBlock
		);
		setCurrentZones(nextZones);
		localStorage.setItem("zoneList3", JSON.stringify(nextZones));
	};

	const sortedZones = [...currentZones].sort((a, b) => {
		const dateA = DateTime.now().setZone(a.timeZone);
		const dateB = DateTime.now().setZone(b.timeZone);
		return dateA.offset - dateB.offset;
	});
	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{ fontSize: "2rem" }}>Times Owner</h1>
			</header>
			<main>
				<section className="upper">
					<ZoneAdder addToZones={addNewZone} />
					<ul className="bar">
						{sortedZones.map((clockBlock, index) => (
							<ClockBlock
								key={`${clockBlock.timeZone}-${index}`}
								{...clockBlock}
								close={removeZone}
							/>
						))}
					</ul>
				</section>
				<hr />
				<section></section>
			</main>
		</div>
	);
}

export default App;
