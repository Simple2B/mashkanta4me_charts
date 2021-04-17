document.addEventListener("DOMContentLoaded", (evt) => {
  const api = new Api("variable_wo");
  api.getFetch((data) => {
    const dashboard = new PrimeDashboard(data, ".prime-container", api);
  });
});
