document.addEventListener('DOMContentLoaded', (evt) => {
  const api = new Api('analytics');
  api.getFetch((data) => {
    const dashboard = new AnalyticsDashboard(data);
  });
});
