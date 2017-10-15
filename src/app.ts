import {Coinigy} from './coinigy';
import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {observable} from 'aurelia-framework';
import {bindingMode} from 'aurelia-framework';
import LocalStorageService from "./LocalStorageService";

// au run --watch
//TODO @inject(Coinigy)
@inject(LocalStorageService)
export class App 
{
  private KeyApiKey = "apiKey";
  private KeyApiSecret = "apiSecret";
  
  @bindable({ defaultBindingMode: bindingMode.twoWay }) 
  apiKey:string;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) 
  apiSecret:string;

  @observable
  pair = "-/-";

  @observable
  exchange:string = null;

  @computedFrom('pair')
  get pairCleaned() {
    return this.pair.split("/").join("").toLocaleLowerCase();
  }
  @computedFrom('pairCleaned')
  get url() {
    return `https://www.tradingview.com/ideas/${this.pairCleaned}`;
  }

  private storage: LocalStorageService;

  constructor(storage:LocalStorageService)
  {
    this.storage = storage;
    
    if (this.storage.isStorageSupported())
    {
      this.apiKey = storage.get(this.KeyApiKey);
      this.apiSecret = storage.get(this.KeyApiSecret);
    }

    this.initWhenReady();
  }

  private apiKeyChanged(newValue:string):void{
    if (this.storage.isStorageSupported())
      this.storage.set(this.KeyApiKey, newValue);
    console.log(newValue);
    this.apiKey = newValue;
    
    this.initWhenReady();
  }

  private apiSecretChanged(newValue:string):void{
    if (this.storage.isStorageSupported())
      this.storage.set(this.KeyApiSecret, newValue);
    
    this.apiSecret = newValue;
    
    this.initWhenReady();
  }
  
  private initWhenReady():void 
  {
    if (this.apiKey && this.apiSecret) 
    {
      let coinigy = new Coinigy(this.apiKey, this.apiSecret);

      let res = coinigy.getExchanges();
      res.then(s => this.exchange = s[0].exch_name.toString());

      let res2 = coinigy.getWatchList();
      res2.then(s => this.pair = s[0].mkt_name.toString());
    }
  }
}
