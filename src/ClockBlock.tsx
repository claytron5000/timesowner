import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Clock from "react-clock";
import { DateTime } from "luxon";
import { TClockBlock } from "./interfaces";

export function ClockBlock(props: TClockBlock) {
	const { timeZone, title, isLocal, close } = props;
	const dateTime = DateTime.now().setZone(timeZone);
	const val = dateTime.toFormat("HH:mm:ss");
	const day = dateTime.hour > 5 && dateTime.hour < 20;
	return (
		<li
			className={`ClockBlock box shadow ${day ? "day" : "night"}`}
			style={isLocal ? { background: "#f0f0ff" } : {}}
			data-theme={!day && !isLocal ? "dark" : "light"}
		>
			<header>
				<h2>{title}</h2>
				{!isLocal && (
					<button
						className="closer icon"
						onClick={() => {
							close(timeZone);
						}}
					>
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
				)}
			</header>

			<Clock value={val} renderNumbers={true} />
			<p>{timeZone}</p>
		</li>
	);
}
