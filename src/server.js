import app from "./app.js";
import dbConfig from "./db/dbConfig.js";
import { serverPort } from "./config/index.js";
import axios from "axios";

// Function to ping the server every 5 minutes (300,000 ms)
setInterval(async () => {
  try {
    await axios.get("https://vaiyer-ponno-backend.onrender.com");
    console.log("Pinged the server to keep it awake.");
  } catch (error) {
    console.error("Error pinging the server:", error.message);
  }
}, 300000);


dbConfig();

app.listen(serverPort);
