import {HttpClient, json} from 'aurelia-fetch-client'
//import {HttpClient} from 'aurelia-http-client'

// http://docs.coinigy.apiary.io/#reference/account-data/watch-list/userwatchlist
// http://json2ts.com
// TODO : use https://github.com/JohnWeisz/TypedJSON

export class Coinigy 
{
  protected httpClient = new HttpClient();

  constructor(apiKey:string, apiSecret:string){
    this.httpClient.configure(config => {
      config
        .withBaseUrl('https://api.coinigy.com/api/v1/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-API-KEY' : apiKey,
            'X-API-SECRET' : apiSecret,
            'X-Requested-With': 'Fetch',
            'Access-Control-Allow-Origin' : '*'
          },
        })
        // https://stackoverflow.com/questions/13146892/cors-access-control-allow-headers-wildcard-being-ignored
        // had to install this for headers to show in req : https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en-US        .withInterceptor({
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

  // http://docs.coinigy.apiary.io/#reference/market-data/list-exchanges/exchanges
  async getExchanges():Promise<Exchange[]>{
    let j = await (await this.httpClient
      .fetch('exchanges', {
        method: 'post',
      }))
      .text();
    
    let js:any = (await JSON.parse(j));

    return Object.assign(new Exchange(), js.data);
  }

  async getWatchList():Promise<WatchItem[]>{
    let j = await (await this.httpClient
      .fetch('userWatchList', {
        method: 'post',
      }))
      .text();

    let js:any = (await JSON.parse(j));

    return Object.assign(new WatchItem(), js.data);
  }
}


export class Exchange
{
  exch_id: number;
  exch_name: string;
  exch_code: string;
  exch_fee: number;
  exch_trade_enabled: boolean;
  exch_balance_enabled: boolean;
  exch_url:string;
}

export class WatchItem {
  exchmkt_id: string;
  mkt_name: string;
  exch_code: string;
  exch_name: string;
  primary_currency_name: string;
  secondary_currency_name: string;
  server_time: string;
  last_price: string;
  prev_price: string;
  high_trade: string;
  low_trade: string;
  current_volume: string;
  fiat_market: string;
  btc_volume: string;
}
