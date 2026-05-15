
let korttiSisalla = false;
let syotettyPin = "";

const otsikko = document.getElementById("status-msg");
const ohje = document.getElementById("instruction-msg");
const modal = document.getElementById("welcome-modal");


/**
 */
function closeModal() {
    modal.style.display = "none";
    

    otsikko.style.display = "block";
    ohje.style.display = "block";
    
    console.log("Automaatti valmis käyttöön.");
}


/**
 */
function processCard() {
    if (!korttiSisalla) {
        korttiSisalla = true;  
        

        otsikko.innerText = "KORTTI LUETTU";
        ohje.innerText = "SYÖTÄ PIN-KOODI";
        
        console.log("Kortti tunnistettu. Odotetaan PIN-koodia.");
        alert("Kortti syötetty onnistuneesti!");
    } else {
        alert("Kortti on jo sisällä.");
    }
}

/**
 */
function handleAction(alueenNimi) {
    console.log("Klikkasit aluetta: " + alueenNimi);
    
    if (alueenNimi === 'NÄPPÄIMISTÖ' && korttiSisalla) {
        ohje.innerText = "NÄPPÄILLÄÄN...";
    }
}

console.log("Pankkiautomaatin logiikka ladattu.");