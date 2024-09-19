import { initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
	apiKey: "AIzaSyAoJGgUFAtClH0b72LzPSCQ8ybFT4vA0uY",
	authDomain: "timezoner-f106e.firebaseapp.com",
	projectId: "timezoner-f106e",
	storageBucket: "timezoner-f106e.appspot.com",
	messagingSenderId: "70309988219",
	appId: "1:70309988219:web:d97f581c90817cc59f1fde",
	measurementId: "G-CVX82W25F4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
