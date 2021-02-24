var ctx = document.getElementById('mortgageChart').getContext('2d');

var mortgageChart = new Chart(ctx, {
  type: 'roundedBar',
  data: {
    labels: ['ריבית העוגן היום', '5', '10', '15', '20', '25'],
    datasets: [{
      data: dataSet,
      backgroundColor: 'rgba(255, 202, 25, 1)',
      borderColor: 'rgba(255, 202, 25, 1)'
    }]
  },
  options: {
    legend: {
      display: false,
      onClick: function (e) {
        e.stopPropagation();
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: mortgageExpectationBarTooltip,
        title: () => {}
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
        gridLines: {
          zeroLineColor: 'rgb(255, 255, 255)',
          color: 'rgba(255, 255, 255, 0.15)'
        },
        scaleLabel: {
          display: true,
          labelString: 'זמן [שנים]'
        },
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          zeroLineColor: 'rgb(255, 255, 255)',
          color: 'rgba(255, 255, 255, 0.15)'
        },
        scaleLabel: {
          display: true,
          labelString: 'ריבית [%]'
        },
      }]
    }
  }
});
