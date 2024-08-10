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
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.rates[toCurrency]) {
                throw new Error('Currency not supported');
            }
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

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

function addToHistory(amount, fromCurrency, result, toCurrency) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    historyList.appendChild(listItem);
    saveHistory();
}

document.getElementById('clearHistoryBtn').addEventListener('click', function() {
    document.getElementById('historyList').innerHTML = '';
    localStorage.removeItem('conversionHistory');
});

function saveHistory() {
    const historyList = document.getElementById('historyList').innerHTML;
    localStorage.setItem('conversionHistory', historyList);
}

function loadHistory() {
    const history = localStorage.getItem('conversionHistory');
    if (history) {
        document.getElementById('historyList').innerHTML = history;
    }
}

window.onload = function() {
    loadHistory();
};

document.getElementById('amount').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('convertBtn').click();
    }
});

document.getElementById('fromCurrency').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('toCurrency').focus();
    }
});

document.getElementById('toCurrency').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('convertBtn').focus();
    }
});
