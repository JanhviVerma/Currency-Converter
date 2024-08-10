document.getElementById('convertBtn').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (!amount || amount <= 0) {
        document.getElementById('result').innerText = 'Please enter a valid amount.';
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerText = '';

    const apiKey = 'YOUR_API_KEY'; // Replace with a real API key
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const conversionRate = data.rates[toCurrency];
            const result = amount * conversionRate;
            document.getElementById('result').innerText = `Converted Amount: ${result.toFixed(2)} ${toCurrency}`;
            addToHistory(amount, fromCurrency, result.toFixed(2), toCurrency);
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            document.getElementById('result').innerText = 'Error fetching exchange rates. Please try again later.';
        })
        .finally(() => {
            document.getElementById('loading').style.display = 'none';
        });
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('amount').value = '';
    document.getElementById('fromCurrency').value = 'USD';
    document.getElementById('toCurrency').value = 'INR';
    document.getElementById('result').innerText = '';
    document.getElementById('loading').style.display = 'none';
});

document.getElementById('swapBtn').addEventListener('click', function() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    document.getElementById('fromCurrency').value = document.getElementById('toCurrency').value;
    document.getElementById('toCurrency').value = fromCurrency;
});

function addToHistory(amount, fromCurrency, result, toCurrency) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    historyList.appendChild(listItem);
}
