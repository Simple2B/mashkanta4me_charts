
const timeFormat = 'MM-YYYY';

const mortgageRanges = {
  'xMin': Infinity,
  'xMax': -Infinity,
  'yMin': Infinity,
  'yMax': -Infinity,
};

var chartConfig = {
  type: 'line',
  data: {datasets: []},
  options: {
    legend: {
      display: true,
      onClick: function (e) { e.stopPropagation(); }
    },

    responsive: true,
    maintainAspectRatio: false,
    tooltips: "",

      animation: { duration: 0 },
      zoom: {
        enabled: false,
        mode: 'xy',
      },

      title: { text: 'ריביות עבר' },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            parser: timeFormat,
            // // round: 'day'
            tooltipFormat: 'MM-YYYY',
          },
          scaleLabel: {
            display: true,
            labelString: 'תאריך [חודשים]'
          },
          gridLines: mortgageOptions.scales.xAxes.gridLines
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'ריבית [%]'
          },
          ticks: {
            suggestedMin: mortgageRanges.yMin,
            suggestedMax: mortgageRanges.yMax,
            stepSize: 0.5,
          },
            gridLines: mortgageOptions.scales.yAxes.gridLines
          }]
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