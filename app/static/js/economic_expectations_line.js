var ctx = document.getElementById('mortgageChart').getContext('2d');

var mortgageChartOptions = {
    yLabel: dataSet[0]['name'] === 'Prime' ? 'ריבית בנק ישראל [%]' : 'אינפלציה [%]'
}

var mortgageChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets:
            dataSet
    },
    options: {
        legend: {
            display: false,
            onClick: function (e) {
                e.stopPropagation();
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: mortgageExpectationLineTooltip,
                title: () => {}
            }
        },
        zoom: {
            enabled: false,
            mode: 'xy',
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: false,
                    callback: function (value) { if (value % 1 === 0) { return value; } }
                },
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'זמן [שנים]'
                },
                gridLines: {
                    zeroLineColor: 'rgb(255, 255, 255)',
                    color: 'rgba(255, 255, 255, 0.15)'
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    //                    callback: function(value) {if (value % 1 === 0) {return value;}}
                },
                scaleLabel: {
                    display: true,
                    labelString: mortgageChartOptions.yLabel
                },
                gridLines: {
                    zeroLineColor: 'rgb(255, 255, 255)',
                    color: 'rgba(255, 255, 255, 0.15)'
                },
            }]
        },
        plugins: {
            zoom: {
                // Container for pan options
                pan: {
                    // Boolean to enable panning
                    enabled: false,

                    // Panning directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow panning in the y direction
                    // A function that is called as the user is panning and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
                    mode: 'x',

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

                    // Function called while the user is panning
                    // onPan: function ({ chart }) { console.log(`I'm panning!!!`); },
                    // Function called once panning is completed
                    // onPanComplete: function ({ chart }) { console.log(`I was panned!!!`); }
                },

                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: false,

                    // Enable drag-to-zoom behavior
                    drag: false,

                    // Drag-to-zoom rectangle style can be customized
                    // drag: {
                    // 	 borderColor: 'rgba(225,225,225,0.3)'
                    // 	 borderWidth: 5,
                    // 	 backgroundColor: 'rgb(225,225,225)'
                    // },

                    // Zooming directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow zooming in the y direction
                    // A function that is called as the user is zooming and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
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

                    // Speed of zoom via mouse wheel
                    // (percentage of zoom on a wheel event)
                    speed: 0.05,

                    // Function called while the user is zooming
                    // onZoom: function ({ chart }) { console.log(`I'm zooming!!!`); },
                    // Function called once zooming is completed
                    // onZoomComplete: function ({ chart }) { console.log(`I was zoomed!!!`); }
                }
            }
        }
    }
});
