document.addEventListener('DOMContentLoaded', (evt) => {
  const btnWrapper = document.querySelector('.historical-wrapper > .reload-btn-wrapper');
  const container = createResetBtn();
  const btn = container.querySelector('button');
  btnWrapper.appendChild(container);

  btn.addEventListener('click', (evt) => {
    for (const [chipName, chipData] of Object.entries(dashboards.historical.yearsChips)) {
      for (const key of Object.keys(chipData['chip'])){
        chipData['chip'][key] = true;
      }

      for (const li of chipData.filter.children){
        const span = li.children[0];
        span.classList.add('chip-selected');
        span.selected = true;
      }
    }

    dashboards.historical.currDataset.forEach((dataset, i) => {
      const dataCopy = Object.assign({}, dataset);
      dashboards.historical.chart.data.datasets[i] = dataCopy;
    });

    dashboards.historical.chart.update();
  });
});
