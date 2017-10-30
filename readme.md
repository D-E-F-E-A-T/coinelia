# coinelia 

## set up

First, run through the commands below to get the application set up on your computer.

```
  $ git clone git@github.com:benoitjadinon/coinelia.git
  $ cd coinelia
  $ npm install
  $ cd aurelia_project
  $ npm install -g aurelia-cli
  $ aurelia run --watch
```

You'll be able to access the application from localhost:9000 once that is running.

Next, generate a new API Key and Secret for your Coinigy account at https://www.coinigy.com/user/account#api. Input the Key and Secret in the input boxes in the top right of your screen. They will be saved in your `localStorage` in your browser.

You may run into issues with `Allow-Control-Allow-Origin` and `X-FRAME` header errors in your console. To bypass those, I use [these](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) [two](https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe/related?hl=en-US) Chrome extensions.

