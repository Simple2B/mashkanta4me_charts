function createPrimeChartConfig(){

const primeChartConfig = {
  type: 'scatter',
  data: {datasets: []},
  options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      onClick: function (e) { e.stopPropagation(); }
    },


    hover: {
      mode: 'nearest'
    },


    tooltips: {
      enabled: false,
    },

    animation: { duration: 0 },
    zoom: {
      enabled: false,
      mode: 'xy',
    },

    scales: {
      xAxes: [{
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
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
          suggestedMin: 0,
          suggestedMax: 5,
          stepSize: 0.4,
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


if (userData.userRole === 'registered'){
      primeChartConfig.options.tooltips = {
        mode: 'single',
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {
            console.log(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
            var monthlyReturn = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
            let mortgageAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x || '';
            let label = 'משכנתה בגובה: ' + mortgageAddComma(mortgageAmount) + ' ש״ח, תשלום חודשי ראשוני: ' + monthlyReturn + ' ש״ח';
            return label;
          },
        }
      }
    } else if(userData.userRole === 'paid'){
      primeChartConfig.options.tooltips = {
        mode: 'single',
        enabled: true,
        callbacks: {
          label: (tooltipItem, data) => {
            const loanNumber = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]['loan_number'];
            var monthlyReturn = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y || '';
            let mortgageAmount = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x || '';
            let label = 'משכנתה בגובה: ' + mortgageAddComma(mortgageAmount) + ' ש״ח, תשלום חודשי ראשוני: ' + monthlyReturn + ' ש״ח' + ' [' + loanNumber + ']';
            return label;
          },
        }
      }
    }


  return primeChartConfig;
}
