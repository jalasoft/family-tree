const express = require("express");

const app = express();

app.use("/main.html", express.static("views/main.html"));
app.use("/static", express.static("views/static"));

app.get("/", (reg, resp) => {
    console.log("Dostal jsem request");
    resp.send("Je to cajk...");
});

app.listen(8986, () => console.log("NASTARTOVANO..."));
