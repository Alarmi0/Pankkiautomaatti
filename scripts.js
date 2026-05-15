// --- MUUTTUJAT JA ASETUKSET ---
const OIKEA_PIN = "1234";
let korttiSisalla = false;
let saldo = 150.20; // Aloitussaldo

const otsikko = document.getElementById("status-msg");
const ohje = document.getElementById("instruction-msg");
const modal = document.getElementById("welcome-modal");
const modalBody = document.getElementById("modal-body");

// --- ALKUNÄYTTÖ JA KIRJAUTUMINEN ---

function naytaKirjautuminen() {
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 5px;">SYÖTÄ PIN</h2>
        <input type="password" id="pin-input" maxlength="4">
        <br>
        <button id="start-btn" onclick="tarkistaPin()">KIRJAUDU</button>
    `;
    
    setTimeout(() => {
        const input = document.getElementById("pin-input");
        if(input) input.focus();
    }, 100);
}

function tarkistaPin() {
    const input = document.getElementById("pin-input");
    
    if (input.value === OIKEA_PIN) {
        naytaValikko();
    } else {
        // Virheviesti näytölle ilman alertia
        modalBody.innerHTML = `
            <h2 style="color: red;">VÄÄRÄ PIN!</h2>
            <button id="start-btn" onclick="naytaKirjautuminen()">Yritä uudelleen</button>
        `;
    }
}

// --- PÄÄVALIKKO ---

function naytaValikko() {
    modalBody.innerHTML = `
        <div class="menu-container">
            <div class="menu-item">SALDO —</div>
            <div class="menu-item">TALLETTAA —</div>
            <div class="menu-item">NOSTA —</div>
        </div>
    `;
    console.log("Valikko ladattu.");
}

// --- TOIMINNOT (Saldo, Talletus, Nosto) ---

function handleAction(alue) {
    console.log("Klikkasit: " + alue);
    
    // Sivunapit toimivat vain kun valikko on auki
    if (alue === 'SIVUNAPIT') {
        const y = event.offsetY; 
        
        if (y < 100) {
            naytaSaldo();
        } else if (y >= 100 && y < 200) {
            naytaTalletus();
        } else if (y >= 200) {
            naytaNosto();
        }
    }
}

function naytaSaldo() {
    modalBody.innerHTML = `
        <h2>TILIN SALDO</h2>
        <h1 style="font-size: 32px;">${saldo.toFixed(2)} €</h1>
        <button id="start-btn" onclick="naytaValikko()">TAKAISIN</button>
    `;
}

function naytaTalletus() {
    modalBody.innerHTML = `
        <h2>TALLETUS</h2>
        <p>Syötä rahat seteliaukkoon.</p>
        <button id="start-btn" onclick="lisaaRahaa(20)">Talleta 20€</button>
        <br>
        <button id="start-btn" style="background: gray;" onclick="naytaValikko()">VALMIS</button>
    `;
}

function lisaaRahaa(maara) {
    saldo += maara;
    naytaSaldo();
}

function naytaNosto() {
    modalBody.innerHTML = `
        <h2>VALITSE SUMMA</h2>
        <button id="start-btn" onclick="suoritaNosto(20)">20 €</button>
        <button id="start-btn" onclick="suoritaNosto(40)">40 €</button>
        <br>
        <button id="start-btn" style="background: red;" onclick="naytaValikko()">PERUUTA</button>
    `;
}

function suoritaNosto(maara) {
    if (saldo >= maara) {
        saldo -= maara;
        modalBody.innerHTML = `
            <h2 style="color: green;">NOSTO ONNISTUI</h2>
            <p>Ole hyvä ja ota ${maara} €</p>
            <button id="start-btn" onclick="naytaValikko()">OK</button>
        `;
    } else {
        modalBody.innerHTML = `
            <h2 style="color: red;">EI KATETTA</h2>
            <p>Tililläsi ei ole tarpeeksi rahaa.</p>
            <button id="start-btn" onclick="naytaValikko()">TAKAISIN</button>
        `;
    }
}


function processCard() {
    if (!korttiSisalla) {
        korttiSisalla = true;
        const cardImg = document.getElementById("moving-card");

        // 1. Näytetään kortti aloituspaikassa
        cardImg.style.display = "block";

        // 2. Käynnistetään liuku-animaatio (pieni viive jotta selain ehtii reagoida)
        setTimeout(() => {
            cardImg.classList.add("card-entering");
        }, 50);

        // 3. Näytetään PIN-ruutu kun animaatio on valmis (1 sekunnin päästä)
        setTimeout(() => {
            const modal = document.getElementById("welcome-modal");
            modal.style.display = "flex";
            naytaKirjautuminen();
            
            // Piilotetaan animaatiokortti, se on nyt "koneen sisällä"
            cardImg.style.display = "none";
        }, 1100); 

        console.log("Kortti syötetty: Pankkikortti.png");
    }
}

// Päivitetään tämä myös, jotta se kohdistuu heti input-kenttään
function naytaKirjautuminen() {
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 5px;">SYÖTÄ PIN</h2>
        <input type="password" id="pin-input" maxlength="4">
        <br>
        <button id="start-btn" onclick="tarkistaPin()">KIRJAUDU</button>
    `;
    
    // Aktivoi tekstikenttä automaattisesti
    setTimeout(() => {
        const input = document.getElementById("pin-input");
        if(input) input.focus();
    }, 100);
}

console.log("Pankkiautomaatin logiikka ladattu onnistuneesti.");