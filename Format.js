const MAX_HISTORY_ITEMS = 3;
let history = [];

function formatImeiString(imeiString) {
    imeiString = imeiString.replace(/\r/g, ""); // Remove caracteres de retorno de carro

    let lines = imeiString.split('\n').map(line => line.trim()).filter(line => line !== '');

    let row1 = [];
    let row2 = [];
    let row3 = [];

    lines.forEach(line => {
        let columns = line.split(/\s+/);
        row1.push(columns[0]);
        row2.push(columns[1]);
        row3.push(columns.slice(2).join(' ')); // Mantém os espaços e caracteres especiais
    });

    return {
        row1: "ESN: " + row1.join(", "),
        row2: "Cobli ID: " + row2.join(", "),
        row3: "Placa: " + row3.join(", ")
    };
}

function formatPlacaString(imeiString) {
    let lines = imeiString.split('\n').map(line => line.trim()).filter(line => line !== '');
    return "Placa: " + lines.join(', ');
}

function displayFormattedStrings(formattedStrings) {
    document.getElementById("formatted_string").innerText = formattedStrings;

    document.querySelector('.formatados').classList.add('ativo');
}

function updateHistory(formattedStrings) {
    // Add the new formatted string to the history
    history.unshift(formattedStrings);

    // Trim the history to the last MAX_HISTORY_ITEMS items
    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }

    // Update the history list in the HTML
    const historyList = document.getElementById("history_list");
    historyList.innerHTML = history.map((item, index) => 
        `<button class="historico-btn" onclick="showHistory(${index})">Histórico ${MAX_HISTORY_ITEMS - index}</button>`
    ).join('');
}

function showHistory(index) {
    // Display the selected item from the history
    document.getElementById("formatted_string").innerText = history[index];
}

function onFormat(type) {
    let imeiString = document.getElementById("imei_string").value;
    let formattedStrings;

    if (type === 'placa') {
        formattedStrings = formatPlacaString(imeiString);
    } else {
        let imeiFormatted = formatImeiString(imeiString);
        formattedStrings = `${imeiFormatted.row1}\n${imeiFormatted.row2}\n${imeiFormatted.row3}`;
    }

    displayFormattedStrings(formattedStrings);
    updateHistory(formattedStrings);
}

function copyToClipboard() {
    let formattedString = document.getElementById("formatted_string").innerText;

    let textarea = document.createElement("textarea");
    textarea.value = formattedString;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    let copyButton = document.getElementById("copyButton");
    copyButton.style.backgroundColor = "green";
    copyButton.textContent = "Copiado!";

    setTimeout(() => {
        copyButton.style.backgroundColor = "";
        copyButton.textContent = "Copiar";
    }, 3000);
}
