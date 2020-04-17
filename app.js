const path = require('path');
const express = require("express");

const app = express();

const mainPagePath = path.resolve(__dirname, "static", "main.html");
const svgPagePath = path.resolve(__dirname, "static", "svg.html");
const viewerPagePath = path.resolve(__dirname, "static", "viewer.html");

app.use("/individual", express.static("static/individual"));
app.use("/static", express.static("static"));

app.get("/", (reg, resp) => {
    resp.sendFile(mainPagePath);
});

app.get("/svg", (reg, resp) => {
    resp.sendFile(svgPagePath);
});

app.get("/v", (reg, resp) => {
    resp.sendFile(viewerPagePath);
});

app.listen(8986, () => console.log("NASTARTOVANO..."));
