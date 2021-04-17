document.addEventListener("DOMContentLoaded", function (evt) {
  var api = new Api("analytics");
  var query = {
    q: "options",
  };
  api.getFetch(function (data) {
    var dashboard = new AnalyticsDashboard(data, ".analytics-container", api);
  }, query);
});
