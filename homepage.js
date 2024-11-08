
function addPassword() {
    const name = document.getElementById('website-name').value;
    const url = document.getElementById('website-url').value;
    const password = document.getElementById('website-password').value;

    if (name && url && password) {
        const tableBody = document.getElementById('password-table').querySelector('tbody');
        
        const row = document.createElement('tr');
        
        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        row.appendChild(nameCell);
        
        // URL cell
        const urlCell = document.createElement('td');
        urlCell.textContent = url;
        row.appendChild(urlCell);

        // Password cell with Show/Hide button
        const passwordCell = document.createElement('td');
        const passwordSpan = document.createElement('span');
        passwordSpan.textContent = '******'; // Default hidden text
        passwordSpan.className = 'password-text';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Show';
        toggleButton.dataset.password = password; // Store the real password
        toggleButton.onclick = () => togglePassword(passwordSpan, toggleButton);

        passwordCell.appendChild(passwordSpan);
        passwordCell.appendChild(toggleButton);
        row.appendChild(passwordCell);

        // Strength bar cell
        const strengthCell = document.createElement('td');
        const strengthBar = document.createElement('div');
        strengthBar.className = 'strength-bar';
        updateStrengthBar(password, strengthBar); // Set initial strength
        strengthCell.appendChild(strengthBar);
        row.appendChild(strengthCell);

        // Copy button cell
        const copyCell = document.createElement('td');
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => copyToClipboard(password);
        copyCell.appendChild(copyButton);
        row.appendChild(copyCell);

        // Delete button cell
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => row.remove();
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        // Add the row to the table
        tableBody.appendChild(row);

        // Clear input fields
        document.getElementById('website-name').value = '';
        document.getElementById('website-url').value = '';
        document.getElementById('website-password').value = '';
    } else {
        alert("Please fill out all fields.");
    }
}

// Function to update the strength bar
function updateStrengthBar(passwordValue, strengthBar) {
    let point = 0;
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    if (passwordValue.length >= 6) {
        const arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
        arrayTest.forEach((item) => {
            if (item.test(passwordValue)) {
                point += 1;
            }
        });
    }

    // Update strength bar style
    strengthBar.style.width = widthPower[point];
    strengthBar.style.backgroundColor = colorPower[point];
}

// Function to toggle password visibility
function togglePassword(passwordSpan, toggleButton) {
    if (passwordSpan.textContent === '******') {
        passwordSpan.textContent = toggleButton.dataset.password;
        toggleButton.textContent = 'Hide';
    } else {
        passwordSpan.textContent = '******';
        toggleButton.textContent = 'Show';
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Password copied to clipboard!");
    }).catch((err) => {
        console.error("Could not copy text: ", err);
    });
}

// Toggle visibility for password input
function togglePasswordVisibility() {
    const passwordField = document.getElementById('website-password');
    const toggleIcon = document.querySelector('.toggle-password');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = '👁️';
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = '🙈';
    }
}
