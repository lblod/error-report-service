# [ERROR-CREATOR-SERVICE]

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
                   "references": "http://xxx.com/person/1234/bestuur"
                 },                
                "relationships":{
                   
                   }
                }
             }
          
```