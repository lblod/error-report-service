import { update } from "mu";
import { getAccount, insertError } from "./queries";
import { querySudo } from "@lblod/mu-auth-sudo";

const SESSION_GRAPH_URI =
  process.env.SESSION_GRAPH || "http://mu.semte.ch/graphs/sessions";

function checkNotEmpty(argument, message = "This cannont be empty!") {
  if (!argument?.length) {
    throw Error(message);
  }
}

async function getAccountBySession(sessionId) {
  checkNotEmpty(sessionId, "No session id!");
  let getAccountQuery = getAccount(SESSION_GRAPH_URI, sessionId);
  const queryResult = await querySudo(getAccountQuery);
  if (queryResult.results.bindings.length) {
    const result = queryResult.results.bindings[0];
    return result.account?.value;
  } else {
    return null;
  }
}

export async function logError(payload, sessionId) {
  const accountUri = await getAccountBySession(sessionId);
  checkNotEmpty(accountUri, "No account found!");

  let detail = payload.data.attributes.detail;
  let references = payload.data.attributes.references;

  let subject = payload.data.attributes.subject;
  checkNotEmpty(subject, "Subject is mandatory!");
  let message = payload.data.attributes.message;
  checkNotEmpty(message, "message is mandatory!");
  let creator = payload.data.attributes.creator;
  checkNotEmpty(creator, "creator is mandatory!");

  console.debug(`an unexpected error occured for account '${accountUri}. Message: ${message}`);

  await update(insertError(creator, subject, message, detail, references));
}
