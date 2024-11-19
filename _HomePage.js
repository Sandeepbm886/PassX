// Function to add password entry and store it in localStorage
function addPassword() {
    const name = document.getElementById('website-name').value;
    const url = document.getElementById('website-url').value;
    const password = document.getElementById('website-password').value;

    if (name && url && password) {
        const username = localStorage.getItem('loggedInUser'); // Assuming user is logged in
        if (!username) {
            alert("Please log in first.");
            return;
        }

        // Retrieve existing passwords for the user or create a new array
        const userPasswords = JSON.parse(localStorage.getItem(username)) || [];

        // Create a new entry object
        const entry = { name, url, password };

        // Add the new entry to the user's array and save back to localStorage
        userPasswords.push(entry);
        localStorage.setItem(username, JSON.stringify(userPasswords));

        // Add the new row to the table
        addPasswordToTable(entry);

        // Clear input fields
        document.getElementById('website-name').value = '';
        document.getElementById('website-url').value = '';
        document.getElementById('website-password').value = '';
    } else {
        alert("Please fill out all fields.");
    }
}

// Function to load saved passwords from localStorage on page load
window.onload = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "login.html";
    } else {
        // Display the welcome message with the logged-in username
        document.getElementById("welcomeMessage").textContent = `Hi, ${loggedInUser}`;
        loadPasswords(); // Load saved passwords if logged in
    }
};

// Function to add a password entry row to the table
// Function to add a password entry row to the table
function addPasswordToTable(entry) {
    const tableBody = document.getElementById('password-table').querySelector('tbody');
    const row = document.createElement('tr');

    // Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;
    row.appendChild(nameCell);

    // URL cell
    const urlCell = document.createElement('td');
    urlCell.textContent = entry.url;
    row.appendChild(urlCell);

    // Password cell with Show/Hide button
    const passwordCell = document.createElement('td');
    const passwordSpan = document.createElement('span');
    passwordSpan.textContent = '******';
    passwordSpan.className = 'password-text';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.dataset.password = entry.password;
    toggleButton.onclick = () => togglePassword(passwordSpan, toggleButton);

    passwordCell.appendChild(passwordSpan);
    passwordCell.appendChild(toggleButton);
    row.appendChild(passwordCell);

    // Strength bar cell
    const strengthCell = document.createElement('td');
    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';
    updateStrengthBar(entry.password, strengthBar);
    strengthCell.appendChild(strengthBar);
    row.appendChild(strengthCell);

    // Copy button cell
    const copyCell = document.createElement('td');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(entry.password);
    copyCell.appendChild(copyButton);
    row.appendChild(copyCell);

    // Edit button cell
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => enableEdit(row, entry);
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Delete button cell
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deletePassword(row, entry);
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
}

// Function to enable edit mode for a row
function enableEdit(row, entry) {
    const cells = row.querySelectorAll('td');

    // Replace the text content of cells with input fields
    cells[0].innerHTML = `<input type="text" value="${entry.name}" />`;
    cells[1].innerHTML = `<input type="text" value="${entry.url}" />`;
    cells[2].innerHTML = `<input type="password" value="${entry.password}" />`;

    // Replace Edit and Delete buttons with Save and Cancel buttons
    cells[cells.length - 2].innerHTML = `<button>Save</button>`;
    cells[cells.length - 2].querySelector('button').onclick = () => saveEdit(row, entry);

    cells[cells.length - 1].innerHTML = `<button>Cancel</button>`;
    cells[cells.length - 1].querySelector('button').onclick = () => cancelEdit(row, entry);
}


// Function to save edits and update localStorage
function saveEdit(row, entry) {
    const inputs = row.querySelectorAll('input');
    const [newName, newUrl, newPassword] = Array.from(inputs).map(input => input.value.trim());

    if (newName && newUrl && newPassword) {
        // Update the entry object
        const updatedEntry = { name: newName, url: newUrl, password: newPassword };

        // Update localStorage for the logged-in user
        const username = localStorage.getItem('loggedInUser');
        const userPasswords = JSON.parse(localStorage.getItem(username)) || [];

        // Replace the old entry with the updated one
        const updatedPasswords = userPasswords.map(item =>
            item.name === entry.name && item.url === entry.url ? updatedEntry : item
        );

        localStorage.setItem(username, JSON.stringify(updatedPasswords));

        // Redraw the updated row
        row.innerHTML = ''; // Clear the row
        addPasswordToTable(updatedEntry); // Re-add the updated entry
    } else {
        alert("All fields must be filled!");
    }
}


// Function to cancel editing and revert to original values
function cancelEdit(row, entry) {
    row.innerHTML = ''; // Clear the row
    addPasswordToTable(entry); // Re-render the original entry
}


// Function to delete a password entry and update localStorage
function deletePassword(row, entryToDelete) {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return;

    // Retrieve and update the user's passwords, excluding the deleted one
    let userPasswords = JSON.parse(localStorage.getItem(username)) || [];
    userPasswords = userPasswords.filter(entry => entry.name !== entryToDelete.name || entry.url !== entryToDelete.url);
    localStorage.setItem(username, JSON.stringify(userPasswords));

    // Remove the row from the table
    row.remove();
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

// Function to copy password to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Password copied to clipboard!");
    }).catch((err) => {
        console.error("Could not copy text: ", err);
    });
}

// Toggle visibility for password input on form
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

// Load passwords when the page is loaded
// Function to load saved passwords from localStorage and display them
function loadPasswords() {
    const username = localStorage.getItem("loggedInUser"); // Retrieve the logged-in user's username
    if (!username) return; // If no user is logged in, exit

    // Retrieve passwords associated with this user from localStorage
    const savedPasswords = JSON.parse(localStorage.getItem(username)) || [];

    // Clear existing rows in the table to avoid duplicates
    const tableBody = document.getElementById('password-table').querySelector('tbody');
    tableBody.innerHTML = ''; 

    // Add each saved password entry to the table
    savedPasswords.forEach((entry) => addPasswordToTable(entry));
}

// Ensure `loadPasswords` is called after successful login
window.onload = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "login.html";
    } else {
        document.getElementById("welcomeMessage").textContent = `Hi, ${loggedInUser}`;
        loadPasswords(); // Load saved passwords if user is logged in
    }
};


window.addEventListener("popstate", (event) => {
    // Check if there is a logged-in user and we're navigating back
    if (localStorage.getItem("loggedInUser")) {
        alert("Logging out due to navigation.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }
});

function logout() {
    localStorage.removeItem("loggedInUser"); // Clear the logged-in user
    alert("You have been logged out.");
    window.location.href = "login.html"; // Redirect to login page
}
