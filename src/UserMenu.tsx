import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "react-modal";

export const UserMenu = () => {
	const [open, setOpen] = useState(false);
	return (
		<section>
			<button onClick={() => setOpen(!open)} className="menu">
				menu
			</button>
			<Modal isOpen={open}>
				<div>
					<h1>login</h1>
				</div>
				<button
					className="closer icon"
					onClick={() => {
						setOpen(false);
					}}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</Modal>
		</section>
	);
};
