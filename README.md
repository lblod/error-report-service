# [ERROR-REPORT-SERVICE]

create a service that will get parameters and create a oslc:Error from it. It shoud NOT use sudo queries but regular queries that go through mu-auth. This way we ensure only a logged in user can create those errors, limiting the risk of random people calling the API.

```
  error-report-service:
    image: lblod/error-report-service:0.1.0
    environment:
      SESSION_GRAPH: "http://mu.semte.ch/graphs/sessions"
    links:
      - db:database
```

## Example request

### Report error (POST):

http://localhost/error-reports

`Accept: application/vnd.api+json`

`Content-Type: application/vnd.api+json`

```
          {
             "data":{
                "type":"error-reports",
                "attributes":{
                   "subject":"organization-portal-frontend",
                   "message":"some error occured",
                   "detail":"some error occured because of smth",
                   "references": "http://xxx.com/person/1234/bestuur",
                   "creator": "http://lblod.data.gift/services/organizationportal-error-service"
                 },                
                "relationships":{
                   
                   }
                }
             }
          
```

Will be persisted as:

```
     
 PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
 PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
 PREFIX persoon: <https://data.vlaanderen.be/ns/persoon#>
 PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
 PREFIX person: <http://www.w3.org/ns/person#>
 PREFIX session: <http://mu.semte.ch/vocabularies/session/>
 PREFIX foaf: <http://xmlns.com/foaf/0.1/>
 PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
 PREFIX oslc: <https://docs.oasis-open-projects.org/oslc-op/core/v3.0/os/core-vocab.html#>
 PREFIX dct: <https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#>
 
     INSERT DATA {
             <http://data.lblod.info/id/error-reports/d3bb9450-db5d-11ec-b8b0-b7ac02188020>  a oslc:Error;
                                                             mu:uuid "d3bb9450-db5d-11ec-b8b0-b7ac02188020";
                                                             dct:created "2022-05-24T12:34:17.237Z"^^xsd:dateTime;
                                                             dct:subject """organization-portal-frontend""";
                                                             oslc:message """some error occured""";
                                                            oslc:largePreview """some error occured because of smth""";
                                                            dct:references  <http://xxx.com/person/1234/bestuur>;
                                                             dct:creator <http://lblod.data.gift/services/organizationportal-error-service>.
```