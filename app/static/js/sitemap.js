document.addEventListener('DOMContentLoaded', (evt) => {
  ["prime", "const_w", "const_wo", "eligibility", "variable_w", "variable_wo"].forEach((dashboard) => {
    const api = new Api(dashboard);
    api.getFetch((data) => {
      const dashboard = new PrimeDashboard(data, '.prime-container', api);
    });
  });
});