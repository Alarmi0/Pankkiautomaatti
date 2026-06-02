// --- MUUTTUJAT JA ASETUKSET ---
const OIKEA_PIN = "1234";
let korttiSisalla = false;
let saldo = 150.20; // Aloitussaldo
let pinYritykset = 0; // LISÄÄ TÄMÄ RIVI: Laskee väärät yritykset (alkaa nollasta)

const otsikko = document.getElementById("status-msg");
const ohje = document.getElementById("instruction-msg");
const modal = document.getElementById("welcome-modal");
const modalBody = document.getElementById("modal-body");

// --- ALKUNÄYTTÖ JA KIRJAUTUMINEN ---

function naytaKirjautuminen() {
    // Jos yrityksiä on jo 3 tai yli, ei päästetä käyttäjää enää yrittämään
    if (pinYritykset >= 3) {
        naytaLukitusRuutu();
        return;
    }

    let yrityksiaJaljella = 3 - pinYritykset;

    modalBody.innerHTML = `
        <h2 style="margin-bottom: 5px;">SYÖTÄ PIN</h2>
        <input type="password" id="pin-input" maxlength="4" readonly style="font-size: 24px; text-align: center; width: 140px; height: 35px; border: 2px solid #000; border-radius: 5px;">
        <p style="font-size: 14px; margin-top: 8px; color: red; font-weight: bold;">Yrityksiä jäljellä: ${yrityksiaJaljella}/3</p>
        <p style="font-size: 13px; margin-top: 5px; color: #555;">
    `;
}

function tarkistaPin() {
    const input = document.getElementById("pin-input");
    if (!input) return;
    
    if (input.value === OIKEA_PIN) {
        pinYritykset = 0; // Nollataan yritykset, jos pääsi sisään
        naytaValikko();
    } else {
        pinYritykset++; // Lisätään yksi virheellinen yritys
        
        if (pinYritykset >= 3) {
            naytaLukitusRuutu();
        } else {
            // Virheviesti ja automaattinen paluu tai nappi seuraavaan yritykseen
            modalBody.innerHTML = `
                <h2 style="color: red;">VÄÄRÄ PIN!</h2>
                <p>Yritä uudelleen.</p>

            `;
            
            // Vaihtoehtoisesti voit laittaa sen palaamaan automaattisesti 2 sekunnin kuluttua:
            setTimeout(() => {
                naytaKirjautuminen();
            }, 2000);
        }
    }
}

// LISÄÄ TÄMÄ FUNKTIO KOODIISI (esim. tarkistaPin-funktion alapuolelle)
function naytaLukitusRuutu() {
    modalBody.innerHTML = `
        <h2 style="color: red; margin-bottom: 10px;">KORTTISI ON LUKITTU!</h2>
        <p style="font-size: 16px; font-weight: bold;">Syötit PIN-koodin 3 kertaa väärin.</p>
        <p style="font-size: 14px; color: #555; margin-top: 10px;">Turvallisuussyistä kortti on lukittu.<br>Ole hyvä ja kokeile hetken päästä uudestaan.</p>
    `;
    
    // Jos haluat, että automaatti "nollautuu" esim. 10 sekunnin kuluttua ja sylkee kortin ulos:
    setTimeout(() => {
        // Tässä voit palauttaa alkutilanteen, jos haluat testata koodia helpommin:
        pinYritykset = 0;
        korttiSisalla = false;
        modalBody.innerHTML = `<h2>Tervetuloa</h2><p>Syötä kortti aloittaaksesi</p>`;
        // Jos welcome-modal pitää piilottaa:
        if (modal) modal.style.display = "none"; 
    }, 10000); // 10000 = 10 sekuntia lukossa, ennen kuin testitila nollautuu
}

// --- PÄÄVALIKKO ---

function naytaValikko() {
    modalBody.innerHTML = `
        <div class="menu-container">
            <div class="menu-item">SALDO —</div>
            <div class="menu-item">TALLETA —</div>
            <div class="menu-item">NOSTA —</div>
        </div>
    `;
    console.log("Valikko ladattu.");
}

// --- TOIMINNOT (Saldo, Talletus, Nosto) ---

function handleAction(alue, event) {
    console.log("Klikkasit: " + alue);
    
    const pinInput = document.getElementById("pin-input");
    const muuSummaInput = document.getElementById("muu-summa-input");
    const talletusSummaInput = document.getElementById("talletus-summa-input");

    // 1. SIVUNAPIT (Saldo, Talletus, Nosto)
    if (alue === 'SIVUNAPIT' && event) {
        
        // Estetään sivunappien toiminta, jos kortti ei ole sisällä TAI PIN-syöttökenttä on näkyvissä.
        if (!korttiSisalla || pinInput) {
            console.log("Toiminto estetty: Syötä oikea PIN-koodi ensin.");
            return;
        }

        const y = event.offsetY; 
        const tekstiRuudulla = modalBody.innerText;
        
        // TARKKA TUNNISTUS: Onko ruudulla nimenomaan NOSTOVALIKKO (container löytyy ja teksti sisältää "20 €")
        const onNostoValikko = modalBody.querySelector('.menu-container') && tekstiRuudulla.includes("20 €");
        
        const onTalletusValikko = tekstiRuudulla.includes("TALLETUS") && !tekstiRuudulla.includes("Syötä talletettava summa");
        const onSaldoValikko = tekstiRuudulla.includes("TILIN SALDO");

        // ====================================================================
        // RIVI 1: YLIN SIVUNAPPI (y < 100)
        // ====================================================================
        if (y < 100) {
            if (onNostoValikko) {
                suoritaNosto(20);      // Nostovalikossa ylin vaihtoehto on 20€
            } else if (onTalletusValikko) {
                // Talletusvalikossa ylin nappi ei tee mitään, koska se on tyhjä rivi
            } else if (tekstiRuudulla.includes("ONNISTUI") || tekstiRuudulla.includes("KATETTA") || tekstiRuudulla.includes("VIRHEELLINEN SUMMA")) {
                // Ilmoitusruuduissa ylin nappi ei tee mitään
            } else {
                naytaSaldo();          // Päävalikossa ylin vaihtoehto on SALDO
            }
        }
        
        // ====================================================================
        // RIVI 2: KESKIMMÄINEN SIVUNAPPI (100 <= y < 200)
        // ====================================================================
        else if (y >= 100 && y < 200) {
            if (onNostoValikko) {
                suoritaNosto(40);      // Nostovalikossa keskimmäinen vaihtoehto on 40€
            } else if (onTalletusValikko) {
                naytaTalletusSyotto(); // Keskimmäinen sivunappi avaa summan syötön, kun ollaan talletusvalikossa
            } else {
                // Estetään avaaminen, jos ollaan jo muissa alivalikoissa tai ilmoitusruuduissa
                if (!onSaldoValikko && !tekstiRuudulla.includes("ONNISTUI") && !tekstiRuudulla.includes("KATETTA") && !tekstiRuudulla.includes("VIRHEELLINEN SUMMA") && !talletusSummaInput) {
                    naytaTalletus();   // Päävalikossa keskimmäinen vaihtoehto on TALLETTAA
                }
            }
        }
        
        // ====================================================================
        // RIVI 3: ALIN SIVUNAPPI (y >= 200)
        // ====================================================================
        else if (y >= 200) {
            if (onNostoValikko) {
                naytaMuuSumma();       // Avataan oma syöttöikkuna muulle summalle
            } else if (onTalletusValikko || onSaldoValikko || tekstiRuudulla.includes("ONNISTUI") || tekstiRuudulla.includes("KATETTA") || tekstiRuudulla.includes("VIRHEELLINEN SUMMA") || talletusSummaInput) {
                naytaValikko();        // Kaikki kuitit ja muut alivalikot palaavat päävalikkoon
            } else {
                naytaNosto();          // Päävalikossa alin vaihtoehto on NOSTA
            }
        }
    }

    // 2. FYYSISET NUMERONAPIT (Näppäimistö - Klikkaustuki ruudulla)
    if (alue === 'NÄPPÄIMISTÖ' && event) {
        
        // Jos mikään syöttökenttä ei ole auki, fyysiset napit eivät tee mitään klikkaamalla
        if (!pinInput && !muuSummaInput && !talletusSummaInput) return; 

        const x = event.offsetX;
        const y = event.offsetY;

        let painettuNappi = "";

        if (y < 50) { // Ensimmäinen rivi: 1, 2, 3, CANCEL
            if (x < 40) painettuNappi = "1";
            else if (x >= 40 && x < 80) painettuNappi = "2";
            else if (x >= 80 && x < 120) painettuNappi = "3";
            else if (x >= 120) { 
                handlePinButton('CANCEL');
                return;
            }
        } 
        else if (y >= 50 && y < 100) { // Toinen rivi: 4, 5, 6, CLEAR
            if (x < 40) painettuNappi = "4";
            else if (x >= 40 && x < 80) painettuNappi = "5";
            else if (x >= 80 && x < 120) painettuNappi = "6";
            else if (x >= 120) { 
                handlePinButton('CLEAR');
                return;
            }
        } 
        else if (y >= 100 && y < 150) { // Kolmas rivi: 7, 8, 9, ENTER
            if (x < 40) painettuNappi = "7";
            else if (x >= 40 && x < 80) painettuNappi = "8";
            else if (x >= 80 && x < 120) painettuNappi = "9";
            else if (x >= 120) { 
                handlePinButton('ENTER');
                return;
            }
        } 
        else if (y >= 150) { // Neljäs rivi: *, 0, #, [Tyhjä]
            if (x >= 40 && x < 80) painettuNappi = "0";
        }

        if (painettuNappi !== "") {
            handlePinButton(painettuNappi);
        }
    }
}

function naytaSaldo() {
    modalBody.innerHTML = `
        <h2>TILIN SALDO</h2>
        <h1 style="font-size: 32px; margin-bottom: 20px;">${saldo.toFixed(2)} €</h1>
        
        <p style="font-size: 11px; color: #333; font-weight: bold; margin-top: 15px;">
            Paina <span style="background-color: red; color: white; padding: 2px 6px; border-radius: 3px; font-size: 13px;">CANCEL</span> päästäksesi takaisin päävalikkoon
        </p>
    `;
}

// --- TALLETUSFUNKTIOT ---

function naytaTalletus() {
 
    modalBody.innerHTML = `
        <h2>TALLETUS</h2>
        <p style="font-size: 14px; margin-bottom: 5px;">Syötä talletettava summa</p>
        
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px; margin-bottom: 15px;">
            <input type="text" id="talletus-summa-input" readonly style="width: 130px; height: 40px; font-size: 24px; text-align: center; border: 3px solid #000; border-radius: 5px; font-family: monospace; font-weight: bold;">
            <span style="font-size: 24px; font-weight: bold; margin-left: 8px;">€</span>
        </div>
        
        <p style="font-size: 11px; font-weight: bold; color: #333; margin-top: 10px;">
            Paina <span style="color: green;">ENTER</span> hyväksyäksesi
        </p>
        <p style="font-size: 11px; color: #333; font-weight: bold; margin-top: 15px;">
            Paina <span style="background-color: red; color: white; padding: 2px 6px; border-radius: 3px; font-size: 13px;">CANCEL</span> päästäksesi takaisin päävalikkoon
        </p>
    `;
    console.log("Talletuksen syöttöruutu ladattu.");
}

function tarkistaTalletus() {
    const input = document.getElementById("talletus-summa-input");
    if (!input || input.value === "") return;

    const maara = parseInt(input.value);

    if (isNaN(maara) || maara <= 0) {
        modalBody.innerHTML = `
            <h2 style="color: red;">VIRHEELLINEN SUMMA</h2>
            <p>Syötä kelvollinen rahasumma.</p>
        `;
        setTimeout(() => {
            naytaTalletusSyotto();
        }, 3000);
        return;
    }

    saldo += maara;
    modalBody.innerHTML = `
        <h2 style="color: green;">TALLETUS ONNISTUI</h2>
        <p>Tilillesi lisätty: ${maara} €</p>
    `;
    
    // Palaa valikkoon 3 sekunnin kuluttua
    setTimeout(() => {
        naytaValikko();
    }, 3000);
    
    console.log("Talletettu " + maara + "€. Uusi saldo: " + saldo);
}

// --- NOSTOFUNKTIOT ---

function naytaNosto() {
    modalBody.innerHTML = `
        <div class="menu-container" style="margin-top: -10px;">
            <div class="menu-item">20 € —</div>
            <div class="menu-item">40 € —</div>
            <div class="menu-item">MUU SUMMA —</div>
        </div>
        <p style="font-size: 11px; color: #333; font-weight: bold; margin-top: 15px;">
            Paina <span style="background-color: red; color: white; padding: 2px 6px; border-radius: 3px; font-size: 13px;">CANCEL</span> päästäksesi takaisin päävalikkoon
        </p>
    `;
    console.log("Nostovalikko ladattu.");
}

function naytaMuuSumma() {
    modalBody.innerHTML = `
        <h2>SYÖTÄ SUMMA</h2>
        <p style="font-size: 14px; margin-bottom: 5px;">Vain 10€ tai 20€ jaolliset summat</p>
        
        <div style="display: flex; align-items: center; justify-content: center; margin-top: 10px; margin-bottom: 15px;">
            <input type="text" id="muu-summa-input" readonly style="width: 130px; height: 40px; font-size: 24px; text-align: center; border: 3px solid #000; border-radius: 5px; font-family: monospace; font-weight: bold;">
            <span style="font-size: 24px; font-weight: bold; margin-left: 8px;">€</span>
        </div>
        
        <p style="font-size: 11px; font-weight: bold; color: #333; margin-top: 10px;">
            Paina <span style="color: green;">ENTER</span> hyväksyäksesi
        </p>
        <p style="font-size: 11px; color: #333; font-weight: bold; margin-top: 15px;">
            Paina <span style="background-color: red; color: white; padding: 2px 6px; border-radius: 3px; font-size: 13px;">CANCEL</span> päästäksesi takaisin päävalikkoon
        </p>
    `;
    console.log("Muun summan syöttöruutu ladattu.");
}

function tarkistaMuuSumma() {
    const input = document.getElementById("muu-summa-input");
    if (!input || input.value === "") return;

    const maara = parseInt(input.value);

    if (isNaN(maara) || maara <= 0 || maara % 10 !== 0) {
        modalBody.innerHTML = `
            <h2 style="color: red;">VIRHEELLINEN SUMMA</h2>
            <p>Automaatista voi nostaa vain 10€, 20€ tai 50€ seteleitä.</p>
        `;
        return;
    }

    suoritaNosto(maara);
}

function suoritaNosto(maara) {
    if (saldo >= maara) {
        saldo -= maara;
        modalBody.innerHTML = `
            <h2 style="color: green;">NOSTO ONNISTUI</h2>
            <p>Ole hyvä ja ota ${maara} €</p>
        `;
        // Palaa valikkoon 3 sekunnin kuluttua
        setTimeout(() => {
            naytaValikko();
        }, 3000);
    } else {
        modalBody.innerHTML = `
            <h2 style="color: red;">EI KATETTA</h2>
            <p>Tililläsi ei ole tarpeeksi rahaa.</p>
        `;
        // Tässä voit myös haluta paluun 3s kuluttua
        setTimeout(() => {
            naytaValikko();
        }, 3000);
    }
}

// --- KORTIN KÄSITTELY ---

function processCard() {
    if (!korttiSisalla) {
        korttiSisalla = true;
        const cardImg = document.getElementById("moving-card");

        if (!cardImg) {
            console.error("Virhe: Elementtiä 'moving-card' ei löytynyt!");
            return;
        }

        // 1. NOLLATAAN ANIMAATIOT JA ASETETAAN ALKUPISTE
        cardImg.style.transition = "none"; 
        cardImg.style.display = "block";   // Pakotetaan näkyviin
        cardImg.style.opacity = "1";       // Varmistetaan näkyvyys

        // 2. KÄYNNISTETÄÄN SUORA LIIKE YLÖSPÄIN
        setTimeout(() => {
            cardImg.style.transition = "bottom 1.8s ease-in-out, opacity 1.2s ease-in-out";
            cardImg.style.bottom = "70px"; 
        }, 50);

        // 3. HÄIVYTETÄÄN KORTTI KUN SE ON SISÄLLÄ
        setTimeout(() => {
            cardImg.style.opacity = "0";
        }, 1000);

        // 4. AVATAAN SALAINEN PIN-RUUTU
        setTimeout(() => {
            const welcomeModal = document.getElementById("welcome-modal");
            if (welcomeModal) welcomeModal.style.display = "flex";
            
            naytaKirjautuminen(); 
            
            cardImg.style.display = "none";
        }, 2000); 
    }
}

// --- NÄPPÄIMISTÖN SYÖTTEIDEN OHJAUS ---

function handlePinButton(arvo) {
    const pinInput = document.getElementById("pin-input");
    const muuSummaInput = document.getElementById("muu-summa-input");
    const talletusSummaInput = document.getElementById("talletus-summa-input");
    
 // 1. CANCEL-painike (Toimii globaalisti missä vain)
    if (arvo === 'CANCEL') {
        if (pinInput) {
            pinInput.value = ""; 
        } else if (muuSummaInput) {
            naytaNosto(); // Palauttaa takaisin nostovalikkoon
        } else if (talletusSummaInput) {
            naytaValikko(); // KORJATTU: Palauttaa nyt takaisin päävalikkoon!
        } else {
            naytaValikko(); // Muissa ruuduissa palataan päävalikkoon
        }
        return;
    }

    // 2. KÄSITTELY KUN SYÖTETÄÄN PIN-KOODIA
    if (pinInput) {
        console.log("Painoit fyysistä nappia (PIN): " + arvo);
        if (arvo === 'CLEAR') {
            pinInput.value = pinInput.value.slice(0, -1);
        } else if (arvo === 'ENTER') {
            tarkistaPin();
        } else if (arvo !== '*' && arvo !== '#') {
            if (pinInput.value.length < 4) {
                pinInput.value += arvo;
            }
        }
    }
    
    // 3. KÄSITTELY KUN SYÖTETÄÄN MUUTA NOSTOSUMMAA
    else if (muuSummaInput) {
        console.log("Painoit fyysistä nappia (SUMMA): " + arvo);
        if (arvo === 'CLEAR') {
            muuSummaInput.value = muuSummaInput.value.slice(0, -1);
        } else if (arvo === 'ENTER') {
            tarkistaMuuSumma();
        } else if (arvo !== '*' && arvo !== '#') {
            if (muuSummaInput.value.length < 5) {
                muuSummaInput.value += arvo;
            }
        }
    }

    // 4. KÄSITTELY KUN SYÖTETÄÄN TALLETUSSUMMAA
    else if (talletusSummaInput) {
        console.log("Painoit fyysistä nappia (TALLETUS): " + arvo);
        if (arvo === 'CLEAR') {
            talletusSummaInput.value = talletusSummaInput.value.slice(0, -1);
        } else if (arvo === 'ENTER') {
            tarkistaTalletus();
        } else if (arvo !== '*' && arvo !== '#') {
            if (talletusSummaInput.value.length < 5) {
                talletusSummaInput.value += arvo;
            }
        }
    }
}

console.log("Pankkiautomaatin logiikka ladattu onnistuneesti.");