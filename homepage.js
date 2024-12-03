
function addPassword() {
    const name = document.getElementById('website-name').value;
    const url = document.getElementById('website-url').value;
    const password = document.getElementById('website-password').value;

    if (name && url && password) {
        const username = localStorage.getItem('loggedInUser'); 
        if (!username) {
            alert("Please log in first.");
            return;
        }

        
        const userPasswords = JSON.parse(localStorage.getItem(username)) || [];

        
        const entry = { name, url, password };

        
        userPasswords.push(entry);
        localStorage.setItem(username, JSON.stringify(userPasswords));

        
        addPasswordToTable(entry);

        
        document.getElementById('website-name').value = '';
        document.getElementById('website-url').value = '';
        document.getElementById('website-password').value = '';
    } else {
        alert("Please fill out all fields.");
    }
}


window.onload = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "login.html";
    } else {
        
        document.getElementById("welcomeMessage").textContent = `Hi, ${loggedInUser}`;
        loadPasswords(); 
    }
};


function addPasswordToTable(entry) {
    const tableBody = document.getElementById('password-table').querySelector('tbody');
    const row = document.createElement('tr');

    
    const nameCell = document.createElement('td');
    nameCell.textContent = entry.name;
    nameCell.setAttribute('data-label', 'Website Name/URL');
    row.appendChild(nameCell);

    
    const urlCell = document.createElement('td');
    urlCell.textContent = entry.url;
    urlCell.setAttribute('data-label', 'UserID');
    row.appendChild(urlCell);

    
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

    
    const strengthCell = document.createElement('td');
    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';
    updateStrengthBar(entry.password, strengthBar);
    strengthCell.setAttribute('data-label', 'Strength');
    strengthCell.appendChild(strengthBar);
    row.appendChild(strengthCell);

    
    const copyCell = document.createElement('td');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(entry.password);
    copyCell.setAttribute('data-label', 'Copy');
    copyCell.appendChild(copyButton);
    row.appendChild(copyCell);
     
     const editCell = document.createElement('td');
     const editButton = document.createElement('button');
     editButton.textContent = 'Edit';
     editCell.setAttribute('data-label', 'Edit');
     editButton.onclick = () => enableEdit(row, entry);
     editCell.appendChild(editButton);
     row.appendChild(editCell);

    
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

    
    cells[0].innerHTML = `<input type="text" value="${entry.name}" />`;
    cells[1].innerHTML = `<input type="text" value="${entry.url}" />`;
    cells[2].innerHTML = `<input type="text" value="${entry.password}" />`; 

    
    cells[cells.length - 2].innerHTML = `<button>Save</button>`;
    cells[cells.length - 2].querySelector('button').onclick = () => saveEdit(row, entry);

    cells[cells.length - 1].innerHTML = `<button>Cancel</button>`;
    cells[cells.length - 1].querySelector('button').onclick = () => cancelEdit(row, entry);

    
    togglePasswordVisibilityInEditMode(row, entry.password);
}
function togglePasswordVisibilityInEditMode(row, password) {
    const passwordInput = row.querySelector('input[type="text"]');
    if (passwordInput) {
        passwordInput.value = password; 
    }
}
function updateStrengthDisplay() {
    const strengthBars = document.querySelectorAll('.strength-bar');
    const widthPower = ["1%", "25%", "50%", "75%", "100%"];
    const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    strengthBars.forEach(bar => {
        const strengthPercentage = parseFloat(bar.style.width) || 0; 
        let color = "#000"; 

        
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
            
            bar.style.display = 'none'; 
            if (!bar.nextElementSibling || !bar.nextElementSibling.classList.contains('strength-percentage')) {
                const percentageText = document.createElement('span');
                percentageText.textContent = `${strengthPercentage}%`;
                percentageText.classList.add('strength-percentage');
                percentageText.style.color = color; 
                bar.parentNode.appendChild(percentageText); 
            } else {
                const percentageText = bar.nextElementSibling;
                percentageText.textContent = `${strengthPercentage}%`; 
                percentageText.style.color = color; 
            }
        } else {
            
            bar.style.display = 'block'; 
            if (bar.nextElementSibling && bar.nextElementSibling.classList.contains('strength-percentage')) {
                bar.nextElementSibling.remove(); 
            }
        }
    });
}


window.addEventListener('load', updateStrengthDisplay);
window.addEventListener('resize', updateStrengthDisplay);





function saveEdit(row, entry) {
    const inputs = row.querySelectorAll('input');
    const [newName, newUrl, newPassword] = Array.from(inputs).map(input => input.value.trim());

    if (newName && newUrl && newPassword) {
        
        const updatedEntry = { name: newName, url: newUrl, password: newPassword };

        
        const username = localStorage.getItem('loggedInUser');
        const userPasswords = JSON.parse(localStorage.getItem(username)) || [];

        
        const updatedPasswords = userPasswords.map(item =>
            item.name === entry.name && item.url === entry.url ? updatedEntry : item
        );

        localStorage.setItem(username, JSON.stringify(updatedPasswords));

        
        updateRowContent(row, updatedEntry);

        
        updateStrengthDisplay(); 
    } else {
        alert("All fields must be filled!");
    }
}



function updateRowContent(row, entry) {
    
    row.cells[0].textContent = entry.name; 
    row.cells[1].textContent = entry.url; 

    
    const passwordCell = row.cells[2];
    passwordCell.innerHTML = ''; 

    const passwordSpan = document.createElement('span');
    passwordSpan.textContent = '******';
    passwordSpan.className = 'password-text';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.dataset.password = entry.password;
    toggleButton.onclick = () => togglePassword(passwordSpan, toggleButton);

    passwordCell.appendChild(passwordSpan);
    passwordCell.appendChild(toggleButton);

    
    const strengthBar = document.createElement('div');
    strengthBar.className = 'strength-bar';
    updateStrengthBar(entry.password, strengthBar);

    row.cells[3].innerHTML = ''; 
    row.cells[3].appendChild(strengthBar);

    
    const editCell = row.cells[row.cells.length - 2];
    editCell.innerHTML = `<button>Edit</button>`;
    editCell.querySelector('button').onclick = () => enableEdit(row, entry);

    const deleteCell = row.cells[row.cells.length - 1];
    deleteCell.innerHTML = `<button>Delete</button>`;
    deleteCell.querySelector('button').onclick = () => deletePassword(row, entry);
}




function cancelEdit(row, entry) {
    row.innerHTML = ''; 
    addPasswordToTable(entry); 
}



function deletePassword(row, entryToDelete) {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return;

    
    let userPasswords = JSON.parse(localStorage.getItem(username)) || [];
    userPasswords = userPasswords.filter(entry => entry.name !== entryToDelete.name || entry.url !== entryToDelete.url);
    localStorage.setItem(username, JSON.stringify(userPasswords));

    
    row.remove();
}


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


function loadPasswords() {
    const username = localStorage.getItem("loggedInUser"); 
    if (!username) return; 

    
    const savedPasswords = JSON.parse(localStorage.getItem(username)) || [];

    
    const tableBody = document.getElementById('password-table').querySelector('tbody');
    tableBody.innerHTML = ''; 

    
    savedPasswords.forEach((entry) => addPasswordToTable(entry));
}


window.onload = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "login.html";
    } else {
        document.getElementById("welcomeMessage").textContent = `Hi, ${loggedInUser}`;
        loadPasswords(); 
    }
};


window.addEventListener("popstate", (event) => {
    
    if (localStorage.getItem("loggedInUser")) {
        alert("Logging out due to navigation.");
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }
});


