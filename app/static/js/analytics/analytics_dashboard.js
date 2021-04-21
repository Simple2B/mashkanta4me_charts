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
      start: [0, 1000000000],
      range: {
        min: 0,
        max: 1000000000,
      },
    };

    this.data = data;
    console.log(data);
    const wrapper = document.querySelector(containerSelector);

    if (userData.userRole === "unregistered") {
      wrapper.addEventListener("click", (evt) => {
        wpAuthModal.style.display = "block";
      });
    }

    this.viewType = false;

    const reset = this.setFilter(wrapper);
    //console.log(reset);
    //primeChartConfig.data.datasets = this.data.dataSet;
    const chartConfig = createAnalyticsChartConfig();
    this.chart = new MortgageChart(chartConfig, wrapper);
    this.chart.chart.clear();
    this.update();
  }

  update() {
    const query = { viewType: this.viewType, filters: [] };
    // generation buttons
    Object.entries(this.viewByFilters[this.viewType]).map((button) => {
      //console.log(button)
      const [buttonName, buttonData] = button;
      //console.log(buttonData);
      if (buttonData.activated) {
        query.filters.push(buttonName);
        //console.log(query.filters);
      }
    });
    console.log(this);
    // get sliders value
    query.x = this.amountMortgage.noUiSlider.get();
    query.y = this.monthlyPayments.noUiSlider.get();

    for (let i = 0; i < query.x.length; i++) {
      query.x[i] = parseFloat(query.x[i]);
    }

    for (let i = 0; i < query.y.length; i++) {
      query.y[i] = parseFloat(query.y[i]);
    }

    const chart = this.chart;
    const monthlyPayments = this.monthlyPayments;
    const amountMortgage = this.amountMortgage;

    // add id for containers filters by radio buttons

    const buttonsListContainer = document.getElementsByClassName(
      "buttonListContainer"
    );
    const arrButtons = Array.from(buttonsListContainer);
    const idForContainer = [
      "MonthlyReturnEdges",
      "MortgageCostEdges",
      "PaymentHalvedEdges",
    ];

    arrButtons.forEach((b, i) => {
      idForContainer.map((idContainer, j) => {
        if (i === j) {
          b.id = idContainer;
        }
      });
    });

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

      amountMortgage.noUiSlider.updateOptions({
        range: { min: data.minX, max: data.maxX },
      });
      monthlyPayments.noUiSlider.updateOptions({
        range: { min: data.minY, max: data.maxY },
      });

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
      "col-lg-3",
      "filter-block",
      "filter-block-analytics"
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
      //console.log(radioData);
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

      const buttonsListContainer = document.getElementsByClassName(
        "buttonListContainer"
      );

      if (userData.userRole === "unregistered") {
        inputHTML.setAttribute("disabled", true);
        inputHTML.disabled = true;
        checkDiv.classList.add("disabled-radio");
      } else {
        inputHTML.addEventListener("change", (evt) => {
          this.viewType = radio;
          //console.log(radio)
          const arrButtonsList = [...buttonsListContainer];
          arrButtonsList.map((container) => {
            //console.log(container)

            if (radio === container.id) {
              container.removeAttribute("hidden");
            }
            if (radio !== container.id) {
              container.setAttribute("hidden", true);
            }
          });

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

    // amount mortgage slider
    const amountMortgageContainer = document.createElement("div");
    amountMortgageContainer.classList.add(
      "col-12",
      "col-lg-3",
      "filter-block",
      "filter-block-analytics"
    );
    const amountMortgageHeader = document.createElement("p");
    amountMortgageHeader.innerHTML = "גובה המשכנתה";
    this.amountMortgage = document.createElement("div");
    this.amountMortgage.setAttribute("id", "sliderYears");

    amountMortgageContainer.appendChild(amountMortgageHeader);
    amountMortgageContainer.appendChild(this.amountMortgage);
    filterArea.appendChild(amountMortgageContainer);

    // filters
    const filtersContainer = document.createElement("div");
    filtersContainer.classList.add(
      "col-12",
      "col-lg-3",
      "filter-block",
      "filter-block-analytics"
    );
    //const filtersHeader = document.createElement("p");
    //filtersHeader.innerHTML = "יחס הלוואה";
    //filtersHeader.innerHTML = "";
    //filtersContainer.appendChild(filtersHeader);

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

    for (const [viewType, filters] of Object.entries(
      this.data.viewTypeFilters
    )) {
      const filtersColumns = document.createElement("div");
      filtersColumns.classList.add(
        "col-12",
        "col-lg-3",
        "filter-block",
        "filter-block-analytics"
      );
      const filtersHeader = document.createElement("p");
      filtersHeader.innerHTML = filters.label;
      const buttonListContainer = document.createElement("div");
      buttonListContainer.classList.add("buttonListContainer");
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

    // Interest slider
    const monthlyPaymentsContainer = document.createElement("div");
    monthlyPaymentsContainer.classList.add(
      "col-12",
      "col-lg-3",
      "filter-block",
      "filter-block-analytics"
    );

    const monthlyPaymentsHeader = document.createElement("p");
    monthlyPaymentsHeader.innerHTML = "החזר חודשי";
    this.monthlyPayments = document.createElement("div");
    this.monthlyPayments.setAttribute("id", "monthlyPayments");

    monthlyPaymentsContainer.appendChild(monthlyPaymentsHeader);
    monthlyPaymentsContainer.appendChild(this.monthlyPayments);
    filterArea.appendChild(monthlyPaymentsContainer);

    container.appendChild(filterArea);

    [this.amountMortgage, this.monthlyPayments].forEach((slider) => {
      noUiSlider.create(slider, this.sliderOptions);
    });

    [this.amountMortgage, this.monthlyPayments].forEach((slider) => {
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
        this.amountMortgage.noUiSlider.set([this.data.minX, this.data.maxX]);
        this.monthlyPayments.noUiSlider.set([this.data.minY, this.data.maxY]);
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
