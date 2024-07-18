function formatImeiString(imeiString) {
    // Remove quebras de linha e espaços extras
    imeiString = imeiString.replace(/\n/g, " ").replace(/\r/g, " ");

    // Divide a string em uma lista de IMEIs usando o espaço como separador
    let imeiList = imeiString.split(/\s+/);

    // Junta a lista de IMEIs em uma string, separando por ", "
    let formattedImeiString = imeiList.join(", ");

    return formattedImeiString;
}

function onSubmit() {
    let imeiString = document.getElementById("imei_string").value;
    let formattedString = formatImeiString(imeiString);
    let formattedOutput = document.getElementById("formatted_string");
    formattedOutput.innerText = formattedString;

    // Exibir a div com a classe formatados
    document.querySelector('.formatados').classList.add('ativo');
}

function copyToClipboard() {
    let formattedOutput = document.getElementById("formatted_string");
    let range = document.createRange();
    range.selectNode(formattedOutput);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    
    // Change button color and text
    let copyButton = document.getElementById("copyButton");
    copyButton.style.backgroundColor = "green";
    copyButton.textContent = "Copiado!";
    
    // Optional: Change the button back after a delay
    setTimeout(() => {
        copyButton.style.backgroundColor = "";
        copyButton.textContent = "Copiar";
    }, 3000);
}
