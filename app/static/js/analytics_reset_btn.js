document.addEventListener('DOMContentLoaded', (evt) => {
  const btnWrapper = document.querySelector('.analytics-wrapper > .reload-btn-wrapper');
  const container = createResetBtn();

  const btn = container.querySelector('button');
  btnWrapper.appendChild(container);

  btn.addEventListener('click', (evt) => {
    for (const [chipName, chipData] of Object.entries(dashboards.analytics.forecastsChips)) {

      for (const key of Object.keys(chipData['chip'])){
        chipData['chip'][key] = true;
      }

      for (const li of chipData.filter.children){
        const span = li.children[0];
        span.classList.add('chip-selected');
        span.selected = true;
      }
    }

    dashboards.analytics.currDataset.forEach((dataset, i) => {
      const dataCopy = Object.assign({}, dataset);
      dashboards.analytics.chart.data.datasets[i] = dataCopy;
    });

    const monthlyRanges = dashboards.analytics.sliders.ranges.monthly;
    const mortgageRanges = dashboards.analytics.sliders.ranges.mortgage;

    dashboards.analytics.sliders.HTML.monthlyReturn.noUiSlider.set([monthlyRanges.min[0], monthlyRanges.max[0]]);
    dashboards.analytics.sliders.HTML.mortgageAmount.noUiSlider.set([mortgageRanges.min[0], mortgageRanges.max[0]]);
    dashboards.analytics.dashboard.updateChart();
  });
});
