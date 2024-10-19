const express = require("express");
const { Port } = require("./config/env");
const errorHandler = require("./errors/errorHandler");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
