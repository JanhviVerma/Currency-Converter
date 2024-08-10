document.getElementById('convertBtn').addEventListener('click', function() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (!amount) {
        document.getElementById('result').innerText = 'Please enter an amount.';
        return;
    }

    document.getElementById('result').innerText = 'Converting...';

    const apiKey = 'YOUR_API_KEY'; // Replace with a real API key
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const conversionRate = data.rates[toCurrency];
            const result = amount * conversionRate;
            document.getElementById('result').innerText = `Converted Amount: ${result.toFixed(2)} ${toCurrency}`;
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            document.getElementById('result').innerText = 'Error fetching exchange rates. Please try again later.';
        });
});
