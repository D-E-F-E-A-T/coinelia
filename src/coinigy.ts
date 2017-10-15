///<reference path="../node_modules/aurelia-fetch-client/dist/aurelia-fetch-client.d.ts"/>
//import {HttpClient} from 'aurelia-http-client'
import {HttpClient} from 'aurelia-fetch-client'
import {QueryLogger} from "./QueryLogger";
import {computedFrom} from 'aurelia-framework';
import {observable} from 'aurelia-framework';

// http://json2ts.com
// TODO : use https://github.com/JohnWeisz/TypedJSON

export class Coinigy 
{
  protected httpClient = new HttpClient();

  // http://docs.coinigy.apiary.io/#reference/market-data/list-exchanges/exchanges
  public async getExchanges():Promise<Exchange[]>{
    let jsonString = await (
        await this.httpClient.fetch('exchanges', { method: 'post' })
      )
      .text();
    
    let js:any = (await JSON.parse(jsonString));

    return Object.assign(new Exchange(), js.data);
  }

// http://docs.coinigy.apiary.io/#reference/account-data/watch-list/userwatchlist
  public async getWatchList():Promise<Pair[]>{
    let jsonString = await (
        await this.httpClient.fetch('userWatchList', { method: 'post'})
      )
      .text();

    let js:any = (await JSON.parse(jsonString));

    return Object.assign([], js.data);
  }

  public activate(apiKey: string, apiSecret: string):void {
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
        // (and this one for iframes https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe/related )
        .withInterceptor(new QueryLogger());
    });
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

export class Pair {
  exchmkt_id: number;
  mkt_name: string;
  exch_code: string;
  exch_name: string;
  primary_currency_name: string;
  secondary_currency_name: string;
  //server_time: Date;
  last_price: number;
  prev_price: number;
  high_trade: number;
  low_trade: number;
  current_volume: number;
  fiat_market: boolean;
  btc_volume: number;
}
