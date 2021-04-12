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
    data = source.chart_data("prime")
    assert data
    assert len(data) == 3
    assert "data" in data[0]
