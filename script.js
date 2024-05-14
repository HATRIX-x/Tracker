// Define an array to store expense history
var expenseHistory = [];

// Function to add an expense to the history array
function addExpenseToHistory(date, amount, category) {
    expenseHistory.push({ date: date, amount: amount, category: category });
}

// Function to display expense history
function displayExpenseHistory() {
    var historyHtml = "<h2>Expense History</h2><ul>";
    expenseHistory.forEach(function(expense) {
        historyHtml += "<li>Date: " + expense.date + ", Amount: $" + expense.amount.toFixed(2) + ", Category: " + expense.category + "</li>";
    });
    historyHtml += "</ul>";
    document.getElementById('expenseHistory').innerHTML = historyHtml;
}


function calculateBudget() {
    var income = parseFloat(document.getElementById('income').value);
    var expenses = parseFloat(document.getElementById('expenses').value);
    var category = document.getElementById('category').value;
    var budgetGoal = parseFloat(document.getElementById('budgetGoal').value);
    var date = new Date().toLocaleDateString(); // Get the current date

    if (isNaN(income) || isNaN(expenses) || isNaN(budgetGoal)) {
        document.getElementById('result').innerText = "Please enter valid numbers for income, expenses, and budget goal.";
        return;
    }

    // Add the expense to history
    addExpenseToHistory(date, expenses, category);

    var budget = income - expenses;
    var progress = (expenses / budgetGoal) * 100;
    var result = "Your budget is $" + budget.toFixed(2);

    if (budget > 0) {
        result += ". You're saving money!";
    } else if (budget < 0) {
        result += ". You're spending more than you earn!";
    } else {
        result += ". You're breaking even!";
    }

    result += " Your expense category is: " + category;
    result += " Progress towards budget goal: " + progress.toFixed(2) + "%";

    document.getElementById('result').innerText = result;

    // Update the chart
    updateChart(income, expenses, budgetGoal);

    // Display the expense history
    displayExpenseHistory();


    // Save budget data to local storage
    saveBudgetDataToLocalStorage(income, expenses, budgetGoal, category);

    // Retrieve budget data from local storage
    var savedBudgetData = getBudgetDataFromLocalStorage();
    if (savedBudgetData) {
        // Budget data retrieved successfully
        console.log(savedBudgetData);
    } else {
        // No budget data found in local storage
        console.log('No saved budget data found.');
    }
}



var myChart;

function updateChart(income, expenses, budgetGoal) {
    if (myChart) {
        myChart.destroy(); // Destroy the existing chart to prevent duplication
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Budget Goal'],
            datasets: [{
                label: 'Amount',
                data: [income, expenses, budgetGoal],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)', // Blue for income
                    'rgba(255, 99, 132, 0.2)', // Red for expenses
                    'rgba(75, 192, 192, 0.2)' // Green for budget goal
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


// Function to save budget data to local storage
function saveBudgetDataToLocalStorage(income, expenses, budgetGoal, category) {
    // Create an object to store budget data
    var budgetData = {
        income: income,
        expenses: expenses,
        budgetGoal: budgetGoal,
        category: category
    };

    // Convert the budget data object to a JSON string
    var budgetDataJSON = JSON.stringify(budgetData);

    // Save the JSON string to local storage
    localStorage.setItem('budgetData', budgetDataJSON);
}

// Function to retrieve budget data from local storage
function getBudgetDataFromLocalStorage() {
    // Retrieve the JSON string from local storage
    var budgetDataJSON = localStorage.getItem('budgetData');

    // Parse the JSON string to convert it back to an object
    var budgetData = JSON.parse(budgetDataJSON);

    // Check if budget data exists in local storage
    if (budgetData) {
        // Return the budget data object
        return budgetData;
    } else {
        // If no budget data found, return null
        return null;
    }
}