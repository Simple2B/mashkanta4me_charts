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
        data = source.chart_data(chart_name)
        assert data
        assert "banks" in data
        assert "dataSet" in data
        data = data["dataSet"]
        assert len(data) == 3
        assert "data" in data[0]
