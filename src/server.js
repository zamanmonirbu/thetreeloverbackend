import app from "./app.js";
import dbConfig from "./db/dbConfig.js";
import { serverPort } from "./config/index.js";

dbConfig();

app.listen(serverPort);
