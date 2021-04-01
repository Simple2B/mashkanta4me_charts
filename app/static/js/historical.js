let dataSet;

document.addEventListener('DOMContentLoaded', (evt) => {
  const api = new Api('historical');

  api.getFetch((data) => {
    dataSet = data.real;
    const dashboard = new HistoricalDashboard(data);
  });
});
