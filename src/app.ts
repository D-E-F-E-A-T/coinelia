import {computedFrom} from 'aurelia-framework';
import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {observable} from 'aurelia-framework';
import {bindingMode} from 'aurelia-framework';
import LocalStorageService from "./LocalStorageService";
import {Coinigy, Pair} from './coinigy';

// au run --watch
@inject(LocalStorageService, Coinigy)
export class App {
  private KeyApiKey = "apiKey";
  private KeyApiSecret = "apiSecret";

  @bindable({defaultBindingMode: bindingMode.twoWay})
  apiKey: string;

  @bindable({defaultBindingMode: bindingMode.twoWay})
  apiSecret: string;

  @observable
  pairs: Pair[] = [];

  @observable
  selectedPair: Pair;

  @observable
  exchange: string;

  @computedFrom('selectedPair')
  get pairCleaned() {
    return this.selectedPair && this.selectedPair.mkt_name && this.selectedPair.mkt_name.split("/").join("").toLocaleLowerCase() || "";
  }

  @computedFrom('pairCleaned')
  get tradingIdeasUrl() {
    return `https://www.tradingview.com/ideas/${this.pairCleaned}`;
  }
  @computedFrom('pairCleaned')
  get tradingChartUrl() {
    return `https://www.tradingview.com/chart/?symbol=${this.selectedPair && this.selectedPair.exch_name}:${this.pairCleaned}`;
  }
  @computedFrom('pairCleaned')
  get coinigyUrl() {
    return `https://www.coinigy.com/main/markets/${this.selectedPair && this.selectedPair.exch_code}/${this.selectedPair && this.selectedPair.mkt_name}`;
  }
  
  @computedFrom('selectedPair')
  get selectedPairName() {
    return this.selectedPair && this.selectedPair.mkt_name && ([this.selectedPair.exch_name, this.selectedPair.mkt_name].join(" ")) || "";
  }

  
  constructor(private storage: LocalStorageService, private coinigy: Coinigy) {
    if (this.storage.isStorageSupported()) {
      this.apiKey = storage.get(this.KeyApiKey);
      this.apiSecret = storage.get(this.KeyApiSecret);
    }

    this.initWhenReady();
  }
  
  private apiKeyChanged(newValue: string): void {
    if (this.storage.isStorageSupported())
      this.storage.set(this.KeyApiKey, newValue);

    this.apiKey = newValue;

    this.initWhenReady();
  }

  private apiSecretChanged(newValue: string): void {
    if (this.storage.isStorageSupported())
      this.storage.set(this.KeyApiSecret, newValue);

    this.apiSecret = newValue;

    this.initWhenReady();
  }

  private initWhenReady(): void {
    if (this.apiKey && this.apiSecret) {
      this.coinigy.activate(this.apiKey, this.apiSecret);
      this.coinigy.getWatchList()
        .then(s => {
          for (let p of s)
            this.pairs.push(p);
        });
    }
  }
}
