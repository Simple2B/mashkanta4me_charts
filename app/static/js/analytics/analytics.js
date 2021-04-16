document.addEventListener('DOMContentLoaded', (evt) => {
  ['prime', 'const_w'].forEach((dashname) => {
    const api = new Api(dashname);
    const query = {
      q: "options",
    };
    api.getFetch((data, query) => {

      const dashboard = new PrimeDashboard(data, '.prime-container', api);
    });
  });
});
