let currentPassword = "";

function generatePassword() {
    const MAX_LEN = 12;
    
    const DIGITS = '0123456789';
    const LOCASE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';
    const UPCASE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const SYMBOLS = '@#$%=:?./|~><*()';
    
    const COMBINED_LIST = DIGITS + LOCASE_CHARACTERS + UPCASE_CHARACTERS + SYMBOLS;
    
    const rand_digit = DIGITS[Math.floor(Math.random() * DIGITS.length)];
    const rand_upper = UPCASE_CHARACTERS[Math.floor(Math.random() * UPCASE_CHARACTERS.length)];
    const rand_lower = LOCASE_CHARACTERS[Math.floor(Math.random() * LOCASE_CHARACTERS.length)];
    const rand_symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    
    let temp_pass = rand_digit + rand_upper + rand_lower + rand_symbol;
    
    for (let i = 0; i < MAX_LEN - 4; i++) {
        temp_pass += COMBINED_LIST[Math.floor(Math.random() * COMBINED_LIST.length)];
    }
    
    const shuffled_pass = temp_pass.split('').sort(() => 0.5 - Math.random()).join('');
    
    currentPassword = shuffled_pass; 
    document.getElementById('password').textContent = shuffled_pass;
    document.getElementById('copyMessage').style.display = 'none'; 
}

function copyPassword() {
    
    const tempInput = document.createElement('input');
    tempInput.value = currentPassword;
    document.body.appendChild(tempInput);

    
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); 
    document.execCommand('copy');

    
    document.body.removeChild(tempInput);

    
    document.getElementById('copyMessage').style.display = 'block';
}
