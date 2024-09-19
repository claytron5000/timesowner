import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Modal from "react-modal";
// import { createUser, signInUser } from "./fireBaseAuthService";
import "firebaseui/dist/firebaseui.css";
import auth from "./auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";

export const UserMenu = () => {
	const [open, setOpen] = useState(false);
	// const [isCreateUser, setIsCreateUser] = useState(false);
	// const [messages, setMessages] = useState("");
	// const formHandler = isCreateUser ? createUser : signInUser;
	// useEffect(() => {
	// 	const ui =
	// 		firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

	// 	ui.start("#firebaseui-auth-container", {
	// 		callbacks: {
	// 			signInSuccessWithAuthResult: function (authResult, redirectUrl) {
	// 				// Action if the user is authenticated successfully
	// 				return true;
	// 			},
	// 			uiShown: function () {
	// 				// This is what should happen when the form is full loaded. In this example, I hide the loader element.
	// 				document.getElementById("loader")!.style.display = "none";
	// 			},
	// 		},
	// 		signInSuccessUrl: "https://www.anyurl.com", // This is where should redirect if the sign in is successful.
	// 		signInOptions: [
	// 			// This array contains all the ways an user can authenticate in your application. For this example, is only by email.
	// 			{
	// 				provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
	// 				requireDisplayName: true,
	// 				disableSignUp: {
	// 					status: true,
	// 				},
	// 			},
	// 		],
	// 		tosUrl: "https://www.example.com/terms-conditions", // URL to you terms and conditions.
	// 		privacyPolicyUrl: function () {
	// 			// URL to your privacy policy
	// 			window.location.assign("https://www.example.com/privacy-policy");
	// 		},
	// 	});
	// }, []);
	return (
		<section>
			<button onClick={() => setOpen(!open)} className="menu">
				menu
			</button>
			<Modal isOpen={open}>
				<div>
					{/* <h1>{isCreateUser ? "create a user" : "sign in"}</h1> */}
					{/* <div className="messages">{messages}</div> */}
					<div id="firebaseui-auth-container"></div>
					{/* <form
						onSubmit={(e) => {
							e.preventDefault();
							const form = new FormData(e.currentTarget);

							const name = form.get("name") as string;
							const password = form.get("password") as string;
							formHandler(name, password)
								.then((res) => {
									console.log(res);
								})
								.catch((e) => {
									console.log(e);
									setMessages("Problem with the login");
								});
						}}
					>
						<label htmlFor="name" className="label">
							User Name
						</label>
						<input type="text" id="name" name="name" />
						<label htmlFor="password" className="for">
							Password
						</label>
						<input type="text" id="password" name="password" />
						<button>go</button>
					</form>
					<button onClick={() => setIsCreateUser(!isCreateUser)}>
						{isCreateUser ? "switch to signin" : "switch to create user"}
					</button> */}
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
