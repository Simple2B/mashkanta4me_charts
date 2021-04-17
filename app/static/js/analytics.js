document.addEventListener("DOMContentLoaded", function (evt) {
  var api = new Api("analytics");
  api.getFetch(function (data) {
    var dashboard = new AnalyticsDashboard(data);
  });
});
