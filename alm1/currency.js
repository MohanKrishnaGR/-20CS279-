// currency.js
angular.module('currencyApp', [])
    .controller('CurrencyController', function($scope, $http) {
        // List of currencies (you can add more)
        $scope.currencies = ['USD', 'EUR', 'INR', 'GBP', 'JPY'];

        // Initialize variables
        $scope.fromCurrency = 'USD';
        $scope.toCurrency = 'INR';
        $scope.amount = 1;
        $scope.conversionResult = null;
        $scope.favoritePairs = JSON.parse(localStorage.getItem('favoritePairs')) || [];
        $scope.conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

        let conversionRates = []; // Store conversion rates for chart

        // Function to fetch exchange rates and convert currency
        $scope.convertCurrency = function() {
            const apiUrl = `https://api.exchangerate-api.com/v4/latest/${$scope.fromCurrency}`;

            $http.get(apiUrl).then(function(response) {
                const rates = response.data.rates;
                const rate = rates[$scope.toCurrency];
                if (rate) {
                    $scope.conversionResult = ($scope.amount * rate).toFixed(2);

                    // Store conversion in history
                    const conversion = {
                        amount: $scope.amount,
                        from: $scope.fromCurrency,
                        to: $scope.toCurrency,
                        result: $scope.conversionResult,
                        rate: rate, // Store rate for visualization
                        date: new Date().toLocaleString()
                    };
                    $scope.conversionHistory.push(conversion);
                    localStorage.setItem('conversionHistory', JSON.stringify($scope.conversionHistory));

                    // Store rate for chart and update the chart
                    conversionRates.push({ date: conversion.date, rate: rate });
                    updateChart();
                }
            }, function(error) {
                console.error('Error fetching exchange rates:', error);
            });
        };

        // Add favorite currency pair
        $scope.addFavorite = function() {
            const pair = { from: $scope.fromCurrency, to: $scope.toCurrency };
            $scope.favoritePairs.push(pair);
            localStorage.setItem('favoritePairs', JSON.stringify($scope.favoritePairs));
        };

        // Remove favorite currency pair
        $scope.removeFavorite = function(index) {
            $scope.favoritePairs.splice(index, 1);
            localStorage.setItem('favoritePairs', JSON.stringify($scope.favoritePairs));
        };

        // Chart.js Configuration
        let ctx = document.getElementById('conversionChart').getContext('2d');
        let conversionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Dates of conversions
                datasets: [{
                    label: 'Conversion Rate',
                    data: [], // Rates of conversion
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Exchange Rate'
                        }
                    }
                }
            }
        });

        // Function to update the chart with conversion history
        function updateChart() {
            // Update the labels (dates) and data (conversion rates) for the chart
            conversionChart.data.labels = conversionRates.map(c => c.date);
            conversionChart.data.datasets[0].data = conversionRates.map(c => c.rate);
            conversionChart.update();
        }
    });
