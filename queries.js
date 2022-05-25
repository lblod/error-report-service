import {
  sparqlEscapeUri,
  uuid,
  sparqlEscapeString,
} from "mu";
const PREFIXES = `
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX session: <http://mu.semte.ch/vocabularies/session/>
PREFIX oslc: <https://docs.oasis-open-projects.org/oslc-op/core/v3.0/os/core-vocab.html#>
PREFIX dct: <https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#>
`;

export function getAccount(sessionGraphUri, sessionId) {
  return `
    ${PREFIXES}
    SELECT ?account
    WHERE {
      GRAPH ${sparqlEscapeUri(sessionGraphUri)} {
          ${sparqlEscapeUri(sessionId)} session:account ?account.
      }
    }

  `;
}

export function insertError(creator, subject, message, detail, references) {
  let now = new Date().toISOString();
  let id = uuid();
  return `
    ${PREFIXES}
    INSERT DATA {
            <http://data.lblod.info/id/error-reports/${id}>  a oslc:Error;
                                                            mu:uuid "${id}";
                                                            dct:created "${now}"^^xsd:dateTime;
                                                            dct:subject ${sparqlEscapeString(
                                                              subject
                                                            )};
                                                            oslc:message ${sparqlEscapeString(
                                                              message
                                                            )};
                                                           ${
                                                             !detail?.length
                                                               ? ""
                                                               : `oslc:largePreview ${sparqlEscapeString(
                                                                   detail
                                                                 )};`
                                                           }
                                                           ${
                                                             !references?.length
                                                               ? ""
                                                               : `dct:references  ${sparqlEscapeUri(
                                                                   references
                                                                 )};`
                                                           }
                                                            dct:creator ${sparqlEscapeUri(
                                                              creator // e.g http://lblod.data.gift/services/loket-error-alert-service
                                                            )}.
  }
    
  `;
}
