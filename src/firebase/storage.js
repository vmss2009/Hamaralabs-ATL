import {getStorage} from "firebase/storage";

import fbApp from "./app";

const storage = getStorage(fbApp);

export default storage;
