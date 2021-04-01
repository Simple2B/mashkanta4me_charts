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
  }

  getFetch(readyHandler){
    // make request without any data send
    const config = Object.assign({}, this.config);
    config.method = 'GET';

    this._fetch(readyHandler, this.endpoint, config)
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
    fetch('api/'.concat(endpoint), config).then((resp) => {
      return resp.text();
    }).then((data_raw) => {
      const data = JSON.parse(data_raw.replace(/\bNaN\b/g, "null"));
      if (data.error){
        console.log(data.err_str);
        return;
      }

      readyHandler(data.data);
    });
  }
}