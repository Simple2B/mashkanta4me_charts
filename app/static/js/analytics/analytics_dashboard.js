let analyticsDashboardCount = 0;

class AnalyticsDashboard {
  constructor(data, containerSelector, api) {
    this.api = api;

    this.sliderOptions = {
      tooltips: [
        wNumb({ decimals: 0, thousand: "," }),
        wNumb({ decimals: 0, thousand: "," }),
      ],
      connect: true,
      direction: "ltr",
      start: [0, 30],
      range: {
        min: 0,
        max: 30,
      },
    };

    this.data = data;
    const wrapper = document.querySelector(containerSelector);

    if (userData.userRole === "unregistered") {
      wrapper.addEventListener("click", (evt) => {
        wpAuthModal.style.display = "block";
      });
    }

    this.viewType = false;

    const reset = this.setFilter(wrapper);
    //primeChartConfig.data.datasets = this.data.dataSet;
    const chartConfig = createAnalyticsChartConfig();
    this.chart = new MortgageChart(chartConfig, wrapper);
    this.chart.chart.clear();
    this.update();
  }

  update() {
    const query = { viewType: this.viewType, filters: [] };

    // generation buttons
    console.log(this.viewByFilters[this.viewType]);
    Object.entries(this.viewByFilters[this.viewType]).map((button) => {
      console.log(button)
      const [buttonName, buttonData] = button;
      if (buttonData.activated) {
        query.filters.push(buttonName);
      }
    })

    // get sliders value
    query.years = this.yearsSlider.noUiSlider.get();
    query.loan = this.sliderInterest.noUiSlider.get();

    for (let i = 0; i < query.years.length; i++) {
      query.years[i] = parseFloat(query.years[i]);
    }

    for (let i = 0; i < query.loan.length; i++) {
      query.loan[i] = parseFloat(query.loan[i]);
    }
    const chart = this.chart;
    console.log(query);
    this.api.getFetch(function (data) {
      chart.chart.data.datasets = data.dataSet;
      console.log(data);
      // dashboard charts ranges
      // x range
      chart.chart.options.scales.xAxes[0].ticks.suggestedMin = data.minX;
      chart.chart.options.scales.xAxes[0].ticks.suggestedMax = data.maxX;
      // y range
      chart.chart.options.scales.yAxes[0].ticks.suggestedMin = data.minY;
      chart.chart.options.scales.yAxes[0].ticks.suggestedMax = data.maxY;

      // this.yearsSlider.noUiSlider.updateOptions({
      //   range: { min: data.minX, max: data.maxX },
      // });
      // this.sliderInterest.noUiSlider.updateOptions({
      //   range: { min: data.minY, max: data.maxY },
      // });
      chart.chart.clear();
      chart.chart.update();
    }, query);
  }

  setFilter(wrapper) {
    const container = document.createElement("div");
    container.classList.add("container", "text-right");
    const filterArea = document.createElement("div");
    filterArea.classList.add("row", "filter-area");

    if (userData.userRole === "unregistered") {
      filterArea.addEventListener("click", (evt) => {
        wpAuthModal.style.display = "block";
      });
    }

    // view by column
    const viewByColumn = document.createElement("div");
    viewByColumn.classList.add(
      "col-12",
      "col-md-4",
      "col-lg-2",
      "filter-block-interest"
    );
    const viewByHeader = document.createElement("p");
    viewByHeader.innerHTML = "תצוגה לפי";
    viewByColumn.appendChild(viewByHeader);
    const viewByRadioUL = document.createElement("ul");
    viewByRadioUL.classList.add("type-select", "type-select-col");

    [
      ["MonthlyReturnEdges", "זינוק מקסימלי חזוי בהחזר החודשי"],
      ["MortgageCostEdges", "עלות המשכנתה לשקל"],
      ["PaymentHalvedEdges", "מתי הקרן תרד במחצית"],
    ].forEach((radioData) => {
      const [radio, labelText] = radioData;
      const inputClass = radio.concat(analyticsDashboardCount);
      const inputHTML = document.createElement("input");
      inputHTML.setAttribute("type", "radio");
      inputHTML.setAttribute("class", inputClass);

      inputHTML.setAttribute("id", inputClass);

      const inputName = "mortgageSwitchChart".concat(analyticsDashboardCount);
      inputHTML.setAttribute("name", inputName);

      const checkDiv = document.createElement("div");
      checkDiv.classList.add("check");

      const label = document.createElement("label");
      label.setAttribute("for", inputClass);
      label.innerHTML = labelText;

      const listElement = document.createElement("li");

      listElement.appendChild(inputHTML);
      listElement.appendChild(checkDiv);
      listElement.appendChild(label);

      if (userData.userRole === "unregistered") {
        inputHTML.setAttribute("disabled", true);
        inputHTML.disabled = true;
        checkDiv.classList.add("disabled-radio");
      } else {
        inputHTML.addEventListener("change", (evt) => {
          this.viewType = radio;
          this.update();
        });
      }

      viewByRadioUL.appendChild(listElement);
    });

    viewByRadioUL.children[0]
      .querySelector("input")
      .setAttribute("checked", true);
    this.viewType = "MonthlyReturnEdges";
    analyticsDashboardCount++;

    viewByColumn.appendChild(viewByRadioUL);
    filterArea.appendChild(viewByColumn);

    // years slider
    const yearsSliderContainer = document.createElement("div");
    yearsSliderContainer.classList.add(
      "col-12",
      "col-md-4",
      "col-lg-2",
      "filter-block-interest"
    );
    const yearsSliderHeader = document.createElement("p");
    yearsSliderHeader.innerHTML = "משך השנים";
    this.yearsSlider = document.createElement("div");
    this.yearsSlider.setAttribute("id", "sliderYears");

    yearsSliderContainer.appendChild(yearsSliderHeader);
    yearsSliderContainer.appendChild(this.yearsSlider);
    filterArea.appendChild(yearsSliderContainer);

    // filters
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add(
      "col-12",
      "col-md-4",
      "col-lg-3",
      "filter-block-interest"
    );
    const filtersHeader = document.createElement("p");
    filtersHeader.innerHTML = "יחס הלוואה";
    filtersContainer.appendChild(filtersHeader);

    const buttonsUL = document.createElement("ul");
    buttonsUL.classList.add("p-0", "mb-0");

    this.viewByFilters = {};

    /*
      data returned from back example:
      data = {
        viewTypeFilters: {
          MonthlyReturnEdge: {
            label: "Homebrew text in header",
            buttons: [
              label: "homebrew ...",
              name: "10%",
            ]
          },
          MortgageCostEdges: {...},
          PaymentHalvedEdges: {...}
        }
      }
    */

    for (const [viewType, filters] of Object.entries(this.data.viewTypeFilters)) {
      const filtersColumns = document.createElement("div");
      filtersColumns.classList.add(
        "col-12",
        "col-md-4",
        "col-lg-3",
        "filter-block-interest"
      );
      const filtersHeader = document.createElement("p");
      filtersHeader.innerHTML = filters.label;
      // filtersContainer.appendChild(filtersHeader);
      const buttonListContainer = document.createElement("div");
      const buttonsList = document.createElement("ul");
      buttonsList.classList.add("p-0", "mb-0");
      this.viewByFilters[viewType] = {};

      filters.buttons.forEach((button) => {
        const buttonLI = document.createElement("li");
        buttonLI.classList.add("d-inline-block", "mb-1");
        const span = document.createElement("span");
        span.classList.add(
          "badge",
          "badge-secondary",
          "chip",
          "ml-1",
          "chip-selected"
        );
        span.innerHTML = button.label;
        buttonLI.appendChild(span);
        buttonsList.appendChild(buttonLI);

        this.viewByFilters[viewType][button.name] = {
          spanNode: span,
          activated: true,
        };

        if (userData.userRole === "unregistered") {
          span.setAttribute("disabled", true);
          span.classList.remove("chip-selected");
          span.classList.add("disabled");
        } else {
          span.addEventListener("click", (evt) => {
            this.viewByFilters[viewType][button.name].activated = !this
              .viewByFilters[viewType][button.name].activated;
            span.classList.toggle("chip-selected");
            this.update();
          });
        }
        buttonListContainer.setAttribute("hidden", true);
        buttonListContainer.appendChild(filtersHeader);
        buttonListContainer.appendChild(buttonsList);
        filtersContainer.appendChild(buttonListContainer);
      });
    }

    filterArea.appendChild(filtersContainer);

    const span = this.viewByFilters[this.viewType][1].spanNode;
    span.parentNode.parentNode.parentNode.removeAttribute("hidden");

    // const span = this.viewByFilters[this.viewType];
    // for (let key in span) {
    //     console.log(span[key].spanNode);
    // }
   

    // Interest slider
    const sliderInterestContainer = document.createElement("div");
    sliderInterestContainer.classList.add(
      "col-12",
      "col-md-6",
      "col-lg-2",
      "filter-block-interest"
    );
    const sliderInterestHeader = document.createElement("p");
    sliderInterestHeader.innerHTML = "ריבית שנתית";
    this.sliderInterest = document.createElement("div");
    this.sliderInterest.setAttribute("id", "sliderInterest");

    sliderInterestContainer.appendChild(sliderInterestHeader);
    sliderInterestContainer.appendChild(this.sliderInterest);
    filterArea.appendChild(sliderInterestContainer);

    container.appendChild(filterArea);

    [this.yearsSlider, this.sliderInterest].forEach((slider) => {
      noUiSlider.create(slider, this.sliderOptions);
    });

    [this.yearsSlider, this.sliderInterest].forEach((slider) => {
      if (userData.userRole === "unregistered") {
        slider.setAttribute("disabled", true);
        slider.disabled = true;
        slider.noUiSlider.disabled = true;
      } else {
        slider.noUiSlider.on(
          "end",
          (values, handle, unencoded, tap, positions, noUiSlider) => {
            this.update();
          }
        );
      }
    });

    wrapper.appendChild(container);
    const resetButton = createResetBtn();
    const resetBtnHTML = resetButton.querySelector(".reload-page-btn");

    if (userData.userRole === "unregistered") {
      resetBtnHTML.classList.add("disabled-button");
      resetBtnHTML.addEventListener("click", (evt) => {
        wpAuthModal.style.display = "block";
      });
    } else {
      resetBtnHTML.addEventListener("click", (evt) => {
        this.yearsSlider.noUiSlider.set([this.data.minX, this.data.maxX]);
        this.sliderInterest.noUiSlider.set([this.data.minY, this.data.maxY]);
        Object.keys(this.viewByFilters).map((viewType) => {
          Object.keys(this.viewByFilters[viewType]).map((buttonName) => {
            this.viewByFilters[viewType][buttonName].activated = true;
            this.viewByFilters[viewType][buttonName].spanNode.classList.add(
              "chip-selected"
            );
          });
        });

        this.update();
      });
    }

    wrapper.appendChild(resetButton);
    return resetButton;
  }
}
