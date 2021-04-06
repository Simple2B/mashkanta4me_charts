document.addEventListener('DOMContentLoaded', (evt) => {
  const api = new Api('historical');

  api.getFetch((data) => {
    const dashboard = new HistoricalDashboard(data);
  });
});
