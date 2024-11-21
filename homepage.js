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
function addPasswordToTable(entry) {
    const tableBody = document.getElementById('password-table').querySelector('tbody');
    const row = document.createElement('tr');

    // Name cell
    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;
    nameCell.setAttribute('data-label', 'Website Name/URL');
    row.appendChild(nameCell);

    // URL cell
    const urlCell = document.createElement('td');
    urlCell.textContent = entry.url;
    urlCell.setAttribute('data-label', 'UserID');
    row.appendChild(urlCell);

    // Password cell with Show/Hide button
    const passwordCell = document.createElement('td');
    const passwordSpan = document.createElement('span');
    passwordSpan.textContent = '******';
    passwordSpan.className = 'password-text';
    passwordCell.setAttribute('data-label', 'Password');

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
    strengthCell.setAttribute('data-label', 'Strength');
    strengthCell.appendChild(strengthBar);
    row.appendChild(strengthCell);

    // Copy button cell
    const copyCell = document.createElement('td');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(entry.password);
    copyCell.setAttribute('data-label', 'Copy');
    copyCell.appendChild(copyButton);
    row.appendChild(copyCell);
     // Edit button cell
     const editCell = document.createElement('td');
     const editButton = document.createElement('button');
     editButton.textContent = 'Edit';
     editCell.setAttribute('data-label', 'Edit');
     editButton.onclick = () => enableEdit(row, entry);
     editCell.appendChild(editButton);
     row.appendChild(editCell);

    // Delete button cell
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deletePassword(row, entry);
    deleteCell.setAttribute('data-label', 'Delete');
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
}
function enableEdit(row, entry) {
    const cells = row.querySelectorAll('td');

    // Replace the text content of cells with input fields
    cells[0].innerHTML = `<input type="text" value="${entry.name}" />`;
    cells[1].innerHTML = `<input type="text" value="${entry.url}" />`;
    cells[2].innerHTML = `<input type="text" value="${entry.password}" />`; // Show actual password in editable mode

    // Replace Edit and Delete buttons with Save and Cancel buttons
    cells[cells.length - 2].innerHTML = `<button>Save</button>`;
    cells[cells.length - 2].querySelector('button').onclick = () => saveEdit(row, entry);

    cells[cells.length - 1].innerHTML = `<button>Cancel</button>`;
    cells[cells.length - 1].querySelector('button').onclick = () => cancelEdit(row, entry);

    // Automatically show the password when editing
    togglePasswordVisibilityInEditMode(row, entry.password);
}
function togglePasswordVisibilityInEditMode(row, password) {
    const passwordInput = row.querySelector('input[type="text"]');
    if (passwordInput) {
        passwordInput.value = password; // Ensure the actual password is shown in the input field
    }
}
function updateStrengthDisplay() {
    const strengthBars = document.querySelectorAll('.strength-bar');
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    strengthBars.forEach(bar => {
        const strengthPercentage = parseFloat(bar.style.width) || 0; // Get current width percentage
        let color = "#000"; // Default color

        // Determine the color based on the percentage
        if (strengthPercentage <= 1) {
            color = colorPower[0];
        } else if (strengthPercentage <= 25) {
            color = colorPower[1];
        } else if (strengthPercentage <= 50) {
            color = colorPower[2];
        } else if (strengthPercentage <= 75) {
            color = colorPower[3];
        } else if (strengthPercentage <= 100) {
            color = colorPower[4];
        }

        if (window.innerWidth <= 768) {
            // For responsive view, show percentage as text
            bar.style.display = 'none'; // Hide the bar
            if (!bar.nextElementSibling || !bar.nextElementSibling.classList.contains('strength-percentage')) {
                const percentageText = document.createElement('span');
                percentageText.textContent = `${strengthPercentage}%`;
                percentageText.classList.add('strength-percentage');
                percentageText.style.color = color; // Apply the color
                bar.parentNode.appendChild(percentageText); // Add percentage next to the bar
            } else {
                const percentageText = bar.nextElementSibling;
                percentageText.textContent = `${strengthPercentage}%`; // Update existing percentage
                percentageText.style.color = color; // Update the color
            }
        } else {
            // For larger screens, show the bar and hide percentage
            bar.style.display = 'block'; // Show the bar
            if (bar.nextElementSibling && bar.nextElementSibling.classList.contains('strength-percentage')) {
                bar.nextElementSibling.remove(); // Remove percentage text
            }
        }
    });
}

// Run the function on page load and whenever the window resizes
window.addEventListener('load', updateStrengthDisplay);
window.addEventListener('resize', updateStrengthDisplay);




// Function to save edits and update localStorage
// Function to save edits and update the existing row without creating a new one
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

        // Update the row directly without adding a new one
        updateRowContent(row, updatedEntry);

        // Re-run the strength display logic to handle responsive views
        updateStrengthDisplay(); // <--- Call this here to ensure the display is updated
    } else {
        alert("All fields must be filled!");
    }
}


// Function to update the content of an existing row
function updateRowContent(row, entry) {
    // Update the cells in the row
    row.cells[0].textContent = entry.name; // Update Website Name
    row.cells[1].textContent = entry.url;  // Update Website URL

    // Update Password cell with toggle functionality
    const passwordCell = row.cells[2];
    passwordCell.innerHTML = ''; // Clear the existing content

    const passwordSpan = document.createElement('span');
    passwordSpan.textContent = '******';
    passwordSpan.className = 'password-text';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.dataset.password = entry.password;
    toggleButton.onclick = () => togglePassword(passwordSpan, toggleButton);

    passwordCell.appendChild(passwordSpan);
    passwordCell.appendChild(toggleButton);

    // Update Strength bar cell
    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';
    updateStrengthBar(entry.password, strengthBar);

    row.cells[3].innerHTML = ''; // Clear the strength cell
    row.cells[3].appendChild(strengthBar);

    // Restore Edit and Delete buttons
    const editCell = row.cells[row.cells.length - 2];
    editCell.innerHTML = `<button>Edit</button>`;
    editCell.querySelector('button').onclick = () => enableEdit(row, entry);

    const deleteCell = row.cells[row.cells.length - 1];
    deleteCell.innerHTML = `<button>Delete</button>`;
    deleteCell.querySelector('button').onclick = () => deletePassword(row, entry);
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


