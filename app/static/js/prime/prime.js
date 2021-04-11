document.addEventListener('DOMContentLoaded', (evt) => {
  const api = new Api('prime');
  api.getFetch((data) => {
    const dashboard = new PrimeDashboard(data, '.prime-container');
  });
});
