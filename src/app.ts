import {Coinigy} from './coinigy';

export class App {
  message = 'Hello World!';
  pair = "ZECUSD";
  exchange:string = null;
  get url() {
    return `https://www.tradingview.com/ideas/${this.pair.split("/").join("")}`;
  }
  
  constructor() 
  {
    //TODO store tokens with https://github.com/matik12/aurelia-oauth/blob/master/src/local-storage-service.ts
    let coinigy = new Coinigy("FILLME","FILLME")
    
    let res = coinigy.getExchanges();
    res.then(s => this.exchange = s[0].exch_name.toString());

    let res2 = coinigy.getWatchList();
    res2.then(s => this.pair = s[0].mkt_name.toString());
  }
}
