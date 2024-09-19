import { initializeApp } from "firebase/app";
import {
	getAuth,
	createUserWithEmailAndPassword,
	User,
	signInWithEmailAndPassword,
} from "firebase/auth";

export const createUser = async (
	email: string,
	password: string
): Promise<User> => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (e) {
		console.log(e);
		throw e;
	}
};

export const signInUser = async (email: string, password: string) => {
	const auth = getAuth();
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);
	return userCredential.user;
};

const firebaseConfig = {
	apiKey: "AIzaSyAoJGgUFAtClH0b72LzPSCQ8ybFT4vA0uY",
	authDomain: "timezoner-f106e.firebaseapp.com",
	projectId: "timezoner-f106e",
	storageBucket: "timezoner-f106e.appspot.com",
	messagingSenderId: "70309988219",
	appId: "1:70309988219:web:d97f581c90817cc59f1fde",
	measurementId: "G-CVX82W25F4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
