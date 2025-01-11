const MAX_HISTORY_ITEMS = 3;
let history = [];

// Função para formatar o IMEI
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
        row1: "ESN: <strong>" + row1.join(", ") + "</strong>",
        row2: "Cobli ID: <strong>" + row2.join(", ") + "</strong>",
        row3: "Placa: <strong>" + row3.join(", ") + "</strong>"
    };
}

// Função para formatar a Placa
function formatPlacaString(imeiString) {
    let lines = imeiString.split('\n').map(line => line.trim()).filter(line => line !== '');
    return "Placa: <strong>" + lines.join(', ') + "</strong>";
}

// Função para exibir as strings formatadas
function displayFormattedStrings(formattedStrings) {
    document.getElementById("formatted_string").innerHTML = formattedStrings;

    const formattedSection = document.querySelector('.formatados');
    if (formattedSection) {
        formattedSection.classList.add('ativo');
    }
}

// Função para atualizar o histórico
function updateHistory(formattedStrings) {
    history.unshift(formattedStrings); // Adiciona a nova string formatada no histórico

    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop(); // Remove o item mais antigo se o histórico exceder o limite
    }

    const historyList = document.getElementById("history_list");
    historyList.innerHTML = history.map((item, index) => 
        `<button class="historico-btn" onclick="showHistory(${index})">Histórico ${MAX_HISTORY_ITEMS - index}</button>`
    ).join('');
}

// Função para mostrar histórico
function showHistory(index) {
    document.getElementById("formatted_string").innerHTML = history[index];
}

// Função chamada ao formatar os dados
function onFormat(type) {
    let imeiString = document.getElementById("imei_string").value.trim();
    let formattedStrings;

    if (type === 'placa') {
        formattedStrings = formatPlacaString(imeiString);
    } else {
        let imeiFormatted = formatImeiString(imeiString);
        formattedStrings = `${imeiFormatted.row1}<br>${imeiFormatted.row2}<br>${imeiFormatted.row3}`;
    }

    displayFormattedStrings(formattedStrings);
    updateHistory(formattedStrings);
}

// Funções de edição do formato
function onEditComma() {
    let imeiString = document.getElementById("imei_string").value;

    let formattedString = imeiString.split('\n').map(line => {
        let columns = line.trim().split(/\s+/);
        return columns.join(',');
    }).join(',');

    displayFormattedStrings(formattedString);
    updateHistory(formattedString);
}

function onEditSemicolon() {
    let imeiString = document.getElementById("imei_string").value;

    let formattedString = imeiString.split('\n').map(line => {
        let columns = line.trim().split(/\s+/);
        return columns.join(';');
    }).join(';');

    displayFormattedStrings(formattedString);
    updateHistory(formattedString);
}

// Função para selecionar a opção de problema
function onSelectOption(option) {
    let formattedStrings = "";

    // Pega as strings formatadas já existentes
    let imeiString = document.getElementById("imei_string").value;
    let imeiFormatted = formatImeiString(imeiString);
    let formattedImei = `${imeiFormatted.row1}\n${imeiFormatted.row2}\n${imeiFormatted.row3}`;

    // Adiciona a informação do problema e descrição dependendo da opção selecionada
    if (option === 'desconectado') {
        formattedStrings = `${formattedImei}<br><strong>Qual problema encontrado:</strong> Dispositivo desconectado ou apresentando desconexões desde<br>
<strong>Descrição do que foi feito:</strong> Alinhamos o cliente sobre as desconexões do dispositivo e pedimos para validar as condições do veículo, caso esteja tudo certo e o dispositivo continuar sem comunicar seguiremos com a troca.<br>`;
    } else if (option === 'indisponivel') {
        formattedStrings = `${formattedImei}<br><strong>Qual problema encontrado:</strong> Dispositivo se encontra indisponível desde<br>
<strong>Descrição do que foi feito:</strong> Reset + envio de comandos seguiremos acompanhando pelas próximas 72h, caso não voltem a comunicar seguiremos com a troca.<br>`;
    } else if (option === 'configuracao') {
        formattedStrings = `${formattedImei}<br><strong>Qual problema encontrado:</strong> Dispositivo se encontra com a configuração inadequada/desatualizada.<br>
<strong>Descrição do que foi feito:</strong> Foi ajustada/atualizada a configuração do dispositivo. Estamos aguardando período de calibração e pedimos para validar se o problema persiste após o ajuste.<br>`;
    }

    // Remove qualquer quebra de linha desnecessária
    formattedStrings = formattedStrings.replace(/\n\s*\n/g, '\n').trim();

    displayFormattedStrings(formattedStrings);
    updateHistory(formattedStrings);
}

// Função para copiar o conteúdo para a área de transferência
function copyToClipboard() {
    let formattedString = document.getElementById("formatted_string").innerHTML;

    let textarea = document.createElement("textarea");
    textarea.value = formattedString.replace(/<br>/g, "\n").replace(/<[^>]+>/g, ""); // Remove tags HTML
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

// Adicionando os botões de seleção dinamicamente
function addSelectButtons() {
    const options = ['desconectado', 'indisponivel', 'configuracao'];
    const container = document.getElementById('buttonsContainer'); // Supondo que você tenha um container no HTML

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        button.addEventListener('click', () => onSelectOption(option));
        container.appendChild(button);
    });
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    addSelectButtons();
});
