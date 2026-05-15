
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

const OIKEA_PIN = "1234";

function naytaKirjautuminen() {
    const modalBody = document.getElementById("modal-body");
    
    // Vaihdetaan sisällöksi PIN-syöttö
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 5px;">SYÖTÄ PIN</h2>
        <input type="password" id="pin-input" maxlength="4">
        <br>
        <button id="start-btn" onclick="tarkistaPin()">KIRJAUDU</button>
    `;
    
    // Kohdistetaan kursori automaattisesti kenttään
    setTimeout(() => {
        const input = document.getElementById("pin-input");
        if(input) input.focus();
    }, 100);
}

function tarkistaPin() {
    const syote = document.getElementById("pin-input").value;
    
    if (syote === OIKEA_PIN) {
        // Sen sijaan että suljettaisiin modal, näytetään valikko
        naytaValikko();
    } else {
        alert("VÄÄRÄ PIN!");
        document.getElementById("pin-input").value = "";
    }
}

function naytaValikko() {
    const modalBody = document.getElementById("modal-body");
    
    // Tyhjennetään laatikon tausta ja asetetaan valikko
    // Käytetään flex-asettelua, jotta tekstit osuvat nappien kohdalle
    modalBody.innerHTML = `
        <div class="menu-container">
            <div class="menu-item">SALDO —</div>
            <div class="menu-item">TALLETTAA —</div>
            <div class="menu-item">NOSTA —</div>
        </div>
    `;
    console.log("Valikko ladattu.");
}
function handleAction(alue) {
    console.log("Klikkasit: " + alue);

    // Jos klikataan sivunappeja, katsotaan korkeus (Y-koordinaatti)
    if (alue === 'SIVUNAPIT') {
        const y = event.offsetY; // Missä kohtaa nappeja klikattiin ylhäältä katsottuna
        
        if (y < 100) {
            alert("Saldosi on 150.20 €");
        } else if (y >= 100 && y < 200) {
            alert("Talletus-toiminto tulossa pian!");
        } else if (y >= 200) {
            alert("Paljonko haluat nostaa?");
        }
    }
}