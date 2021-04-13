class Api {
  constructor(endpoint){
    this.endpoint = endpoint;
    this.config = {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    this.appRoot = document.querySelector('.app-root').value;
  }

  getFetch(readyHandler, queryString=''){
    // make request without any data send
    const config = Object.assign({}, this.config);
    config.method = 'GET';

    if (queryString){
      queryString = '?q='.concat(JSON.stringify(queryString));
    }

    this._fetch(readyHandler, this.endpoint + queryString, config);
  }

  sendFetch(data, readyHandler){
    // make request with some data to send
    const config = Object.assign({}, this.config);
    config.method = 'POST';
    config.body = JSON.stringify(data);

    this._fetch(readyHandler, this.endpoint, config);
  }

  loadFilter(readyHandler){
    const config = Object.assign({}, this.config);
    config.method = 'POST';
    config.body = JSON.stringify({filter: this.endpoint});

    this._fetch(readyHandler, 'get/filter', config);
  }

  _fetch(readyHandler, endpoint, config){
    fetch(location.origin.concat(this.appRoot, '/api/data/', endpoint), config).then((resp) => {
      return resp.json();
    }).then((dataset => {
      readyHandler(dataset);
    }));
  }
}