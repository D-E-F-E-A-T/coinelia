import {Interceptor} from "aurelia-fetch-client";

export class QueryLogger implements Interceptor {
  request(request) {
    console.log(`Requesting ${request.method} ${request.url}`);
    return request;
  }

  response(response) {
    console.log(`Received ${response.status} ${response.url}`);
    return response;
  }
}