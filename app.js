import { app } from "mu";

import bodyParser from "body-parser";
import { logError } from "./error-service";

const HEADER_MU_SESSION_ID = "mu-session-id";


app.use(
  bodyParser.json({
    type: function (req) {
      return /^application\/json/.test(req.get("content-type"));
    },
  })
);

app.post("/error-reports", async function (req, res, next) {
  try {
    const sessionId = req.get(HEADER_MU_SESSION_ID);
    const payload = req.body;
    await logError(payload, sessionId);
    return res.status(200).send().end();
  } catch (e) {
    return next(e);
  }
});

function error(res, message, status = 400) {
  return res.status(status).json({ errors: [{ title: message }] });
}

app.use(error);
