document.addEventListener('DOMContentLoaded', (evt) => {
  
  const api = new Api('const_w');
  api.getFetch((data) => {
    const dashboard = new PrimeDashboard(data, '.prime-container', api);
  });
});