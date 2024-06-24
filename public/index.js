function getColor(stock) {
    const colors = {
        "GME": 'rgba(61, 161, 61, 0.7)',
        "MSFT": 'rgba(209, 4, 25, 0.7)',
        "DIS": 'rgba(18, 4, 209, 0.7)',
        "BNTX": 'rgba(166, 43, 158, 0.7)'
    };
    return colors[stock];
}

async function main() {
    const canvasIds = ['#time-chart', '#highest-price-chart', '#average-price-chart'];
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=ffe888ec058d4793a30b77c2717fb90f`);
    const result = await response.json();
    const { GME, MSFT, DIS, BNTX } = result;
    const stocks = [GME, MSFT, DIS, BNTX];
    
    stocks.forEach(stock => stock.values.reverse());

    const createChart = (canvas, type, labels, datasets) => {
        new Chart(canvas.getContext('2d'), {
            type,
            data: { labels, datasets }
        });
    };

    // Time Chart
    const timeLabels = stocks[0].values.map(value => value.datetime);
    const timeDatasets = stocks.map(stock => ({
        label: stock.meta.symbol,
        backgroundColor: getColor(stock.meta.symbol),
        borderColor: getColor(stock.meta.symbol),
        data: stock.values.map(value => parseFloat(value.high))
    }));
    createChart(document.querySelector(canvasIds[0]), 'line', timeLabels, timeDatasets);

    // High Chart
    const highLabels = stocks.map(stock => stock.meta.symbol);
    const highDatasets = [{
        label: 'Highest',
        backgroundColor: highLabels.map(symbol => getColor(symbol)),
        borderColor: highLabels.map(symbol => getColor(symbol)),
        data: stocks.map(stock => findHighest(stock.values))
    }];
    createChart(document.querySelector(canvasIds[1]), 'bar', highLabels, highDatasets);

    // Average Chart
    const averageDatasets = [{
        label: 'Average',
        backgroundColor: highLabels.map(symbol => getColor(symbol)),
        borderColor: highLabels.map(symbol => getColor(symbol)),
        data: stocks.map(stock => calculateAverage(stock.values))
    }];
    createChart(document.querySelector(canvasIds[2]), 'pie', highLabels, averageDatasets);
}

function findHighest(values) {
    return Math.max(...values.map(value => parseFloat(value.high)));
}

function calculateAverage(values) {
    const total = values.reduce((acc, value) => acc + parseFloat(value.high), 0);
    return total / values.length;
}

main();