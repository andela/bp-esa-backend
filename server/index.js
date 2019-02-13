import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import "@babel/polyfill";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import ms from "ms";
import validateEnvironmentVars from "./validator";
import swaggerConfig from "../docs/swagger";
import routes from "./routes";
import worker from "./jobs/worker";

dotenv.config();

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

routes(app);

validateEnvironmentVars();
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);

const port = parseInt(process.env.PORT, 10) || 8000;
app.set("port", port);

// Start worker
worker.init();

app.listen(port, () => {
  console.log(`App listening on port ${app.get("port")}`);
  console.log(`Timer Interval is set to ${process.env.TIMER_INTERVAL}`);
  setInterval(() => worker.exec(), ms(process.env.TIMER_INTERVAL || "1d"));
});

export default app;
