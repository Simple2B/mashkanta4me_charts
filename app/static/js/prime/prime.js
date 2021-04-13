document.addEventListener('DOMContentLoaded', (evt) => {
  ['prime', 'const_w'].forEach((dashname) => {
    const api = new Api(dashname);
    api.getFetch((data) => {
      const dashboard = new PrimeDashboard(data, '.prime-container', api);
    });
  });
});
