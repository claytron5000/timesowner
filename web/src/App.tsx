import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import "./ClockBlock.css";
import "./ZoneAdder.css";
import "bulma/css/bulma.css";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import ZoneAdder from "./ZoneAdder";
import { InstantiatedClockBlock } from "./interfaces";
import { ClockBlock } from "./ClockBlock";
import { UserMenu } from "./UserMenu";
import { User } from "firebase/auth";
const UserContext = createContext<User | undefined>(undefined);
function App() {
	const local: InstantiatedClockBlock = {
		title: "Local",
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		isLocal: true,
		dateTime: DateTime.now(),
	};
	const [currentZones, setCurrentZones] = useState<
		Array<InstantiatedClockBlock>
	>([local]);

	useEffect(() => {
		const zoneList = localStorage.getItem("zoneList3");
		if (zoneList) {
			setCurrentZones(
				JSON.parse(zoneList, (key, value) => {
					if (key === "dateTime") {
						return DateTime.now();
					}
					return value;
				})
					.map((z: InstantiatedClockBlock) => ({
						...z,
						dateTime: z.dateTime.setZone(z.timeZone),
					}))
					.concat([local])
			);
		}
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			const nextZones = currentZones.map(
				(clockBlock: InstantiatedClockBlock) => {
					const now = DateTime.now();
					const newZone = now.setZone(clockBlock.timeZone);
					return { ...clockBlock, dateTime: newZone };
				}
			);
			setCurrentZones(nextZones);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [currentZones]);

	const addNewZone = (iana: string, title: string) => {
		if (currentZones.find((z) => z.title === title)) return false;
		const newtz: InstantiatedClockBlock = {
			timeZone: iana,
			title,
			dateTime: DateTime.now().setZone(iana.toString()),
		};
		const zones = currentZones.concat([newtz]);
		setCurrentZones(zones);

		setZonesToLocal(zones);
		return true;
	};

	const removeZone = (clockBlock: string) => {
		const nextZones = currentZones.filter((zone) => zone.title !== clockBlock);
		setCurrentZones(nextZones);
		setZonesToLocal(nextZones);
	};

	const sortedZones = [...currentZones].sort((a, b) => {
		return a.dateTime.offset - b.dateTime.offset;
	});
	return (
		<div className="App">
			<header className="App-header">
				<h1 style={{ fontSize: "2rem" }}>Times Owner</h1>
				<UserMenu />
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

function setZonesToLocal(zones: InstantiatedClockBlock[]) {
	zones = zones.filter((z) => !z.isLocal);
	localStorage.setItem("zoneList3", JSON.stringify(zones));
}
