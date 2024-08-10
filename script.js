document.getElementById('convertBtn').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    let conversionRate = 1;

    if (fromCurrency === 'USD' && toCurrency === 'INR') {
        conversionRate = 75;
    } else if (fromCurrency === 'EUR' && toCurrency === 'GBP') {
        conversionRate = 0.85;
    }

    const result = amount * conversionRate;
    document.getElementById('result').innerText = `Converted Amount: ${result} ${toCurrency}`;
});
