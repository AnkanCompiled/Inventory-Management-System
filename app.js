import express from "express";
import { Port } from "./config/env.js";
import errorHandler from "./errors/errorHandler.js";
import routes from "./routes/indexRoute.js";
import fileUpload from "express-fileupload";

const app = express();
app.use(fileUpload());
app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
