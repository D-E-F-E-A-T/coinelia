import {HttpClient, json} from 'aurelia-fetch-client'
//import {HttpClient} from 'aurelia-http-client'
//import 'whatwg-fetch';

export class Coinigy 
{
  protected httpClient = new HttpClient();

  private _apiKey: string;

  private _apiSecret: string;

  constructor(apiKey:string, apiSecret:string){
    this._apiKey = apiKey;
    this._apiSecret = apiSecret;

    this.httpClient.configure(config => {
      config
        //.useStandardConfiguration()
        .withBaseUrl('https://api.coinigy.com/api/v1/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY' : this._apiKey,
            'X-API-SECRET' : this._apiSecret,
            'X-Requested-With': 'Fetch',
            //'Access-Control-Allow-Origin' : '*'
          },
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }

  async getExchanges():Promise<string>{
    return (await this.httpClient
      .fetch('exchanges', { //userWatchList
        method: 'post',
        mode: 'no-cors',
      }))
      .text();
  }
}
