import app from "./fireBase"; // This is the Firebase object from the previous tutorial
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export default auth;
