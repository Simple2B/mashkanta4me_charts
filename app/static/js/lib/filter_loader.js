class FilterLoader {
    constructor (filterName) {
        this.api = new Api('get/filter');
        this.filterName = filterName;
        this.api.sendFetch({filter: filterName}, (data) => {
          const filterContainer = document.querySelector('.filter-wrapper');
          // insert HTML
          for (let i = 0; i < data.html.length; i++){
            const content = data.html[i];
            const htmlContainer = document.createElement('div');
            htmlContainer.classList.add('filter-html');
            htmlContainer.innerHTML = content;

            filterContainer.appendChild(htmlContainer);
          }
          // insert JS scripts
          for (let i = 0; i < data.js.length; i++){
            const jsContent = data.js[i];
            const scriptTag = document.createElement('script');
            const scriptContent = document.createTextNode(jsContent);
            scriptTag.setAttribute('data', {a: 1, b: 25});
            scriptTag.appendChild(scriptContent);

            filterContainer.appendChild(scriptTag);
          }

        });
    }
}