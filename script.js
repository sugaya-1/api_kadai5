function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const emailFromURL = getQueryParam('email');
const passwordFromURL = getQueryParam('password');

console.log('Email from URL:', emailFromURL);
console.log('Password from URL:', passwordFromURL);

function submitForm(emailFromURL, passwordFromURL) {
    var calories = document.getElementById('calories').value;

    fetch(`http://127.0.0.1:8000/calories/email=${emailFromURL}&key=${passwordFromURL}&calories=${calories}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({}), 
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data saved:', data);

        return fetch(`http://127.0.0.1:8000/calories/getall/?email=${emailFromURL}&key=${passwordFromURL}`);
    })
    .then(response => response.json())
    .then(data => {
        console.log('All data:', data);

        displayData(data);
    })
    .catch(error => console.error('Error:', error));
}

function displayData(data) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // 今日のデータ
    var todayData = data.filter(row => row.date === getTodayDateString())[0];

    if (todayData) {
        
        var calorieTable = createTable(['Date', 'Calories']);
        addCalorieRow(calorieTable, todayData.date, todayData.calories);
        resultDiv.appendChild(calorieTable);

        
        var exerciseTable = createTable(['Exercise', 'Value']);

      
        if (todayData.calories) {
            addExerciseRow(exerciseTable, 'Walking', todayData.calories / 180);
        }

        
        if (todayData.calories) {
            addExerciseRow(exerciseTable, 'Running', todayData.calories / 400);
        }

        
        if (todayData.calories) {
            addExerciseRow(exerciseTable, 'Cycling', todayData.calories / 420);
        }

        
        if (todayData.calories) {
            addExerciseRow(exerciseTable, 'Swimming', todayData.calories / 300);
        }

        resultDiv.appendChild(exerciseTable);
    }
}

function addCalorieRow(table, date, calories) {
    var dataRow = table.insertRow();

    var dateCell = dataRow.insertCell();
    dateCell.textContent = date;

    var calorieCell = dataRow.insertCell();
    calorieCell.textContent = calories;
}

function addExerciseRow(table, exercise, value) {
    var dataRow = table.insertRow();

    var exerciseCell = dataRow.insertCell();
    exerciseCell.textContent = exercise;

    var valueCell = dataRow.insertCell();
    valueCell.textContent = value.toFixed(2);
}

function createTable(headers) {
    var table = document.createElement('table');

   
    var headerRow = table.insertRow();
    headers.forEach(header => {
        var headerCell = headerRow.insertCell();
        headerCell.textContent = header;
    });

    return table;
}

function getTodayDateString() {
    return new Date().toISOString().split('T')[0]; 
}
