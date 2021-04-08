from app.controllers import ChartDataSource


def test_get_data():
    source = ChartDataSource()
    # source.update()
    names = source.charts
    assert names
    for chart in names:
        data = source.chart_data(chart)
        assert data
