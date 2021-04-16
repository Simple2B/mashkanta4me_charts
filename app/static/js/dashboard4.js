document.addEventListener('DOMContentLoaded', (evt) => {
  
  const api = new Api('eligibility');
  api.getFetch((data) => {
    const dashboard = new PrimeDashboard(data, '.prime-container', api);
  });
});