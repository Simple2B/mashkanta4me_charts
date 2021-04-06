dashboards.analytics.chartConfig = {
  type: 'scatter',
  data: {datasets: []},
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      onClick: function (e) { e.stopPropagation(); }
    },

    tooltips: {
      callbacks: {
        label: () => {},
      }
    },

    animation: { duration: 0 },
    zoom: {
      enabled: false,
      mode: 'xy',
    },

    scales: {
      xAxes: [{
        ticks: {
          suggestedMin: 200000,
          suggestedMax: 1800000,
          beginAtZero: false,
          callback: mortgageAddComma,
        },
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: 'משכנתא [אלפי ש״ח]',
        },
        gridLines: mortgageOptions.scales.xAxes.gridLines
      }],
      yAxes: [{
        ticks: {
          suggestedMin: 1000,
          suggestedMax: 10000,
          beginAtZero: false,
          callback: mortgageAddComma
        },
        scaleLabel: {
          display: true,
          labelString: 'תשלום חודשי ראשוני [שקלים חדשים]',
        },
        gridLines: mortgageOptions.scales.yAxes.gridLines,
      }],
    },
    plugins: {
      zoom: {
        // Container for pan options
        pan: {
          // Boolean to enable panning
          enabled: false,
          mode: 'xy',
          rangeMin: {
            // Format of min pan range depends on scale type
            x: null,
            y: null
          },
          rangeMax: {
            // Format of max pan range depends on scale type
            x: null,
            y: null
          },
        },

        // Container for zoom options
        zoom: {
          // Boolean to enable zooming
          enabled: false,
          // Enable drag-to-zoom behavior
          drag: false,
          mode: 'xy',
          rangeMin: {
            // Format of min zoom range depends on scale type
            x: null,
            y: null
          },
          rangeMax: {
            // Format of max zoom range depends on scale type
            x: null,
            y: null
          },
          speed: 0.05, // Speed of zoom via mouse wheel
        }
      }
    }
  },
}

dashboards.analytics.sliders = {
  options: {
    tooltips: [wNumb({ decimals: 0, thousand: ',' }), wNumb({ decimals: 0, thousand: ',' })],
    connect: true,
    direction: 'ltr',
    start: [0, 1],
    range: {
      'min': 0,
      'max': 1,
    }
  }
}

document.addEventListener('DOMContentLoaded', (e) => {
  const sliderMortgageAmount = document.getElementById('sliderMortgageAmount');
  const sliderMonthlyReturn = document.getElementById('sliderMonthlyReturn');

  dashboards.analytics.sliders.HTML = {
    mortgageAmount: sliderMortgageAmount,
    monthlyReturn: sliderMonthlyReturn,
  }
});
