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

function handleAction(alue, event) {
    console.log("Klikkasit: " + alue);
    
    // 1. SIVUNAPIT (Saldo, Talletus, Nosto)
    if (alue === 'SIVUNAPIT' && event) {
        const y = event.offsetY; 
        if (y < 100) {
            naytaSaldo();
        } else if (y >= 100 && y < 200) {
            naytaTalletus();
        } else if (y >= 200) {
            naytaNosto();
        }
    }

    // 2. FYYSISET NUMERONAPIT (Näppäimistö)
    if (alue === 'NÄPPÄIMISTÖ' && event) {
        const pinInput = document.getElementById("pin-input");
        
        // Jos PIN-ruutu ei ole auki, napit eivät tee mitään
        if (!pinInput) return; 

        // Lasketaan klikkauksen paikka näppäimistöalueella
        const x = event.offsetX;
        const y = event.offsetY;

        // Koska näppäimistö on jaettu ruudukkoon (esim. 4 riviä, 4 saraketta)
        // Lasketaan painettu numero koordinaattien perusteella:
        let painettuNappi = "";

        if (y < 50) { // Ensimmäinen rivi: 1, 2, 3, CANCEL
            if (x < 40) painettuNappi = "1";
            else if (x >= 40 && x < 80) painettuNappi = "2";
            else if (x >= 80 && x < 120) painettuNappi = "3";
            else if (x >= 120) { // CANCEL painettu -> tyhjennetään kenttä
                pinInput.value = "";
                return;
            }
        } 
        else if (y >= 50 && y < 100) { // Toinen rivi: 4, 5, 6, CLEAR
            if (x < 40) painettuNappi = "4";
            else if (x >= 40 && x < 80) painettuNappi = "5";
            else if (x >= 80 && x < 120) painettuNappi = "6";
            else if (x >= 120) { // CLEAR painettu -> poistetaan viimeinen merkki
                pinInput.value = pinInput.value.slice(0, -1);
                return;
            }
        } 
        else if (y >= 100 && y < 150) { // Kolmas rivi: 7, 8, 9, ENTER
            if (x < 40) painettuNappi = "7";
            else if (x >= 40 && x < 80) painettuNappi = "8";
            else if (x >= 80 && x < 120) painettuNappi = "9";
            else if (x >= 120) { // ENTER painettu -> tarkistetaan PIN
                tarkistaPin();
                return;
            }
        } 
        else if (y >= 150) { // Neljäs rivi: *, 0, #, [Tyhjä]
            if (x >= 40 && x < 80) painettuNappi = "0";
        }

        // Jos painettiin numeroa ja PIN-kentässä on vielä tilaa (max 4 merkkiä)
        if (painettuNappi !== "" && pinInput.value.length < 4) {
            pinInput.value += painettuNappi;
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

        // 1. PAKOTETAAN KORTTI VALTAVAKSI
        cardImg.style.width = "380px"; 
        cardImg.style.height = "auto";
        cardImg.style.position = "absolute";
        cardImg.style.zIndex = "1000"; 

        // 2. ALOITUSPAIKKA
        cardImg.style.left = "60px"; 
        cardImg.style.bottom = "-400px"; 
        cardImg.style.transition = "all 2.5s ease-in-out";

        // Näytetään kortti lähtöasemassa
        cardImg.style.display = "block";

        // 3. KÄYNNISTETÄÄN ANIMAATIO
        setTimeout(() => {
            cardImg.style.bottom = "200px"; 
            cardImg.style.transform = "rotateX(70deg) scale(0.1)";
            cardImg.style.opacity = "0";
        }, 50);

        // 4. AVATAAN POPUP JA KÄYNNISTETÄÄN TOIMINNOT
        setTimeout(() => {
            const modal = document.getElementById("welcome-modal");
            modal.style.display = "flex";
            
            // --- TÄMÄ RIVI KORJAA JUMIUTUMISEN ---
            naytaKirjautuminen(); 
            // -------------------------------------
            
            // Piilotetaan animaatiokortti kokonaan
            cardImg.style.display = "none";
            // Nollataan tyylit seuraavaa kertaa varten
            cardImg.style.transform = "none";
            cardImg.style.opacity = "1";
        }, 2600); 
    }
}

function handlePinButton(arvo) {
    const pinInput = document.getElementById("pin-input");
    if (!pinInput) return; // Jos PIN-ruutu ei ole auki, napit eivät tee mitään

    console.log("Painoit fyysistä nappia: " + arvo);

    if (arvo === 'CANCEL') {
        pinInput.value = "";
    } else if (arvo === 'CLEAR') {
        pinInput.value = pinInput.value.slice(0, -1);
    } else if (arvo === 'ENTER') {
        tarkistaPin();
    } else if (arvo !== '*' && arvo !== '#') {
        // Jos on numero ja tilaa on vielä (max 4 merkkiä)
        if (pinInput.value.length < 4) {
            pinInput.value += arvo;
        }
    }
}

console.log("Pankkiautomaatin logiikka ladattu onnistuneesti.");
