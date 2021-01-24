const express = require('express');
const fb = require("firebase-admin");
const path = require('path');
const fetch = require('isomorphic-fetch');
const axios = require('axios');

const logger = require('./logger');

const serverCredentials = require("./server-creds.json");
const serviceAccount = serverCredentials.firebaseConfig;

// Fetch cli args
const IS_DEV = process.env["DEV"];
const PORT = process.env.PORT || 8080;

logger.info(`Starting server in ${IS_DEV ? "dev" : "prod"} mode`);

fb.initializeApp({
    credential: fb.credential.cert(serviceAccount),
    databaseURL: "https://" + serviceAccount.project_id + "firebaseio.com"
});

const app = express();

let logUsage = () => {
    const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    const totalMem = Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100;
    const memRSS = Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100;
    logger.info(`Resource Usage\nCPU\t${process.cpuUsage().user}\nMemory\t${mem}MB / ${totalMem}MB\nMem RSS\t${memRSS}`)
}

// Enable json
app.use(express.json());

// Optimize Endpoint
app.get("/canvas", (req, res) => {
    axios.get('https://wpi.instructure.com/api/v1/courses', {
        headers: { 
            Authorization: `Bearer ${serverCredentials.canvas}` 
        }
    }).then(resp => {
        console.log(resp);
        res.status(200).send(resp.data);
    }, err => {
        res.status(500).send("Canvas Req Failed");
        logger.error("Canvas req failed", err);
    });
});

let staticHandler = express.static("dist");

if(IS_DEV) {
    // If dev, use Parcel for HMR
    const Bundler = require('parcel-bundler');
    const bundler = new Bundler('client/index.html', {
        hmr: true,
        hmrPort: 4321,
    });
    staticHandler = bundler.middleware();
}
    
// Host compiled app
app.use("/", staticHandler);
// Allow React Router to handle subroutes
app.use("/:route/", staticHandler);
app.use("/:route/:subroute", staticHandler);
app.use("/:route/:subroute/:subsubroute", staticHandler);
// App Manifest
app.get("/manifest.json", (req, res) => {
    res.sendFile("./dist/manifest.json", {root: __dirname});
});

// Start the server
logger.info("Binding to port "+PORT);
app.listen(PORT, () => {
    logger.success(`App listening on port ${PORT}`);
    logger.success("Press Ctrl+C to quit.");
});
