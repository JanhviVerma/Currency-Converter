const rateCache = {};
const CACHE_DURATION = 3600000; // 1 hour

document.getElementById('convertBtn').addEventListener('click', convertCurrency);
document.getElementById('resetBtn').addEventListener('click', resetForm);
document.getElementById('swapBtn').addEventListener('click', swapCurrencies);
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
document.getElementById('savePreferences').addEventListener('click', savePreferences);
document.getElementById('languageSelect').addEventListener('change', changeLanguage);
document.getElementById('amount').addEventListener('keydown', handleEnterKey);
document.getElementById('fromCurrency').addEventListener('keydown', handleEnterKey);
document.getElementById('toCurrency').addEventListener('keydown', handleEnterKey);

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (!amount || amount <= 0) {
        showError('Please enter a valid amount.');
        return;
    }

    showLoading(true);
    clearResult();

    fetchExchangeRate(fromCurrency, toCurrency)
        .then(rate => {
            const result = amount * rate;
            showResult(`${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`);
            addToHistory(amount, fromCurrency, result.toFixed(2), toCurrency);
            displayRateChart(fromCurrency, toCurrency);
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            showError('Unable to fetch exchange rates. Please try again later.');
        })
        .finally(() => {
            showLoading(false);
        });
}

function fetchExchangeRate(fromCurrency, toCurrency) {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cachedRate = rateCache[cacheKey];
    
    if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
        return Promise.resolve(cachedRate.rate);
    }
    
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    return fetch(apiUrl)
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
            const rate = data.rates[toCurrency];
            rateCache[cacheKey] = { rate, timestamp: Date.now() };
            return rate;
        });
}

function resetForm() {
    document.getElementById('amount').value = '';
    document.getElementById('fromCurrency').value = localStorage.getItem('defaultFromCurrency') || 'USD';
    document.getElementById('toCurrency').value = localStorage.getItem('defaultToCurrency') || 'EUR';
    clearResult();
    showLoading(false);
}

function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

function showResult(message) {
    document.getElementById('result').innerHTML = message;
}

function clearResult() {
    document.getElementById('result').innerHTML = '';
}

function showError(message) {
    document.getElementById('result').innerHTML = `<div class="error">${message}</div>`;
}

function addToHistory(amount, fromCurrency, result, toCurrency) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
    historyList.appendChild(listItem);
    saveHistory();
}

function clearHistory() {
    document.getElementById('historyList').innerHTML = '';
    localStorage.removeItem('conversionHistory');
}

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

function savePreferences() {
    const defaultFromCurrency = document.getElementById('defaultFromCurrency').value;
    const defaultToCurrency = document.getElementById('defaultToCurrency').value;
    localStorage.setItem('defaultFromCurrency', defaultFromCurrency);
    localStorage.setItem('defaultToCurrency', defaultToCurrency);
    alert('Preferences saved!');
}

function changeLanguage() {
    const language = document.getElementById('languageSelect').value;
    setLanguage(language);
}

function setLanguage(lang) {
    const translations = {
        en: {
            amount: 'Amount:',
            from: 'From:',
            to: 'To:',
            convert: 'Convert',
            reset: 'Reset',
            history: 'Conversion History',
            clearHistory: 'Clear History',
            preferences: 'Preferences',
            savePreferences: 'Save Preferences',
            language: 'Select Language',
        },
        es: {
            amount: 'Cantidad:',
            from: 'De:',
            to: 'A:',
            convert: 'Convertir',
            reset: 'Restablecer',
            history: 'Historial de Conversión',
            clearHistory: 'Borrar Historial',
            preferences: 'Preferencias',
            savePreferences: 'Guardar Preferencias',
            language: 'Seleccionar Idioma',
        },
        fr: {
            amount: 'Montant:',
            from: 'De:',
            to: 'À:',
            convert: 'Convertir',
            reset: 'Réinitialiser',
            history: 'Historique des Conversions',
            clearHistory: 'Effacer l\'Historique',
            preferences: 'Préférences',
            savePreferences: 'Enregistrer les Préférences',
            language: 'Sélectionner la Langue',
        },
        de: {
            amount: 'Betrag:',
            from: 'Von:',
            to: 'Nach:',
            convert: 'Konvertieren',
            reset: 'Zurücksetzen',
            history: 'Umrechnungshistorie',
            clearHistory: 'Verlauf löschen',
            preferences: 'Einstellungen',
            savePreferences: 'Einstellungen speichern',
            language: 'Sprache wählen',
        },
        zh: {
            amount: '金额：',
            from: '从：',
            to: '到：',
            convert: '转换',
            reset: '重置',
            history: '转换历史',
            clearHistory: '清除历史',
            preferences: '偏好设置',
            savePreferences: '保存偏好设置',
            language: '选择语言',
        },
    };

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('label[data-tooltip]').forEach(label => {
        const key = label.getAttribute('data-tooltip');
        if (translations[lang][key]) {
            label.setAttribute('data-tooltip', translations[lang][key]);
        }
    });

    document.getElementById('languageSelect').value = lang;
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        if (event.target.id === 'amount') {
            document.getElementById('fromCurrency').focus();
        } else if (event.target.id === 'fromCurrency') {
            document.getElementById('toCurrency').focus();
        } else if (event.target.id === 'toCurrency') {
            convertCurrency();
        }
    }
}

function displayRateChart(fromCurrency, toCurrency) {
    const ctx = document.getElementById('rateChart').getContext('2d');
    
    // Fetch historical data (you may need to use a different API for historical data)
    fetchHistoricalRates(fromCurrency, toCurrency)
        .then(historicalRates => {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Object.keys(historicalRates),
                    datasets: [{
                        label: `${fromCurrency} to ${toCurrency}`,
                        data: Object.values(historicalRates),
                        borderColor: '#4a90e2',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Historical Exchange Rates'
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching historical rates:', error);
        });
}

function fetchHistoricalRates(fromCurrency, toCurrency) {
    // This is a placeholder function. You'll need to implement this using a real API that provides historical data.
    // For demonstration purposes, we'll return mock data.
    return Promise.resolve({
        '2023-01-01': 1.2,
        '2023-02-01': 1.22,
        '2023-03-01': 1.18,
        '2023-04-01': 1.21,
        '2023-05-01': 1.23
    });
}

window.onload = function() {
    loadHistory();
    document.getElementById('fromCurrency').value = localStorage.getItem('defaultFromCurrency') || 'USD';
    document.getElementById('toCurrency').value = localStorage.getItem('defaultToCurrency') || 'EUR';
    setLanguage(localStorage.getItem('language') || 'en');
};