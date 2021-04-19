from app.controllers import ChartDataSource


def test_get_data():
    source = ChartDataSource()
    # source.update()
    names = source.charts
    assert names
    for chart in names:
        data = source.chart_data(chart)
        assert data


def test_get_prime_data():
    source = ChartDataSource()
    for chart_name in (
        "prime",
        "const_w",
        "const_w",
        "eligibility",
        "variable_w",
        "variable_wo",
    ):
        for options in [{}, dict(bankView=True)]:
            data = source.chart_data(chart_name, options)
            assert data
            assert "banks" in data
            assert "dataSet" in data
            data_set = data["dataSet"]
            if "bankView" in options:
                assert "banks" in data
                assert len(data_set) == len(data["banks"])
            else:
                assert len(data_set) == 3
            assert "data" in data_set[0]


def test_get_analytics_data():
    source = ChartDataSource()
    data = source.chart_data("analytics", {"q": "options"})
    assert data
    data = source.chart_data("analytics", {"viewType": "MonthlyReturnEdges"})
    assert data
    data = source.chart_data("analytics", {"viewType": "MortgageCostEdges"})
    assert data
    data = source.chart_data("analytics", {"viewType": "PaymentHalvedEdges"})
    assert data
