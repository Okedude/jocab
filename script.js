// ... (vorherige JavaScript-Funktionen: displayLeaderboard, showLevelTimes, formatTime, startTimer, stopTimer, etc.) ...

const originalModeButton = document.getElementById("originalMode");
const showdownModeButton = document.getElementById("showdownMode");
const modeSelect = document.getElementById("modeSelect");
let gameMode = "original"; // Standardmäßig "original" Modus
let currentUsers = []; // Array zum Speichern der aktuellen Benutzer

originalModeButton.addEventListener("click", () => {
    gameMode = "original";
    modeSelect.style.display = "none";
    level = 1;
    resetGame();
    gameLoop();
});

showdownModeButton.addEventListener("click", () => {
    gameMode = "showdown";
    modeSelect.style.display = "none";
    showUserList(); // Zeigt die Benutzerliste an
});

// Funktion zum Anzeigen der Benutzerliste
function showUserList() {
    // Annahme: Du hast eine Funktion, um die Benutzer von deinem Server abzurufen
    // Hier wird ein Beispiel mit simulierten Daten verwendet
    fetchUserList()
        .then(users => {
            currentUsers = users;
            const userList = currentUsers.map(user => `<li>${user.username} (${user.ip})</li>`).join("");
            const userListPopup = document.createElement("div");
            userListPopup.innerHTML = `
                <h2>Aktuelle Benutzer</h2>
                <ul>${userList}</ul>
                <button id="startGameButton">Noch nicht verfügbar. Coming soon!</button>
            `;
            userListPopup.style.position = "absolute";
            userListPopup.style.top = "50%";
            userListPopup.style.left = "50%";
            userListPopup.style.transform = "translate(-50%, -50%)";
            userListPopup.style.backgroundColor = "white";
            userListPopup.style.border = "1px solid #ccc";
            userListPopup.style.borderRadius = "5px";
            userListPopup.style.padding = "20px";
            userListPopup.style.zIndex = "14";
            document.body.appendChild(userListPopup);

            const startGameButton = document.getElementById("startGameButton");
            startGameButton.addEventListener("click", () => {
                userListPopup.style.display = "none";
                level = 1;
                resetGame();
                gameLoop();
            });
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Benutzerliste:", error);
            alert("Fehler beim Abrufen der Benutzerliste.");
        });
}

// Beispiel-Funktion zum Abrufen der Benutzerliste (ersetze dies durch deine Server-Logik)
function fetchUserList() {
    return new Promise((resolve) => {
        // Hier werden simulierte Benutzerdaten zurückgegeben
        const simulatedUsers = [
            { username: "Bot1", ip: "0001" },
            { username: "Bot2", ip: "0002" },
            { username: "Bot3", ip: "0003" },
        ];
        resolve(simulatedUsers);
    });
}

// ... (Rest des Spielcodes) ...

// Level-Reset-Funktion aktualisieren
function resetGame() {
    // Standardwerte zurücksetzen
    jakobRadius = 25;
    jakobX = Math.random() * canvas.width;
    jakobY = Math.random() * canvas.height;
    hochstrasserRadius = jakobRadius * 2;
    hochstrasserX = Math.random() * canvas.width;
    hochstrasserY = Math.random() * canvas.height;
    hochstrasserSpeed = jakobSpeed * 1;
    hochstrasserDirectionX = (Math.random() - 0.5) * 2;
    hochstrasserDirectionY = (Math.random() - 0.5) * 2;
    orbs = [];
    obstacleCount = 5;
    obstacles = [];
    gameOver = false;
    win = false;
    gameMessage.style.display = "none";
    level2Button.style.display = "none";
    level3Button.style.display = "none";
    level4Button.style.display = "none";
    restartLevel1Button.style.display = "none";
    canvas.style.backgroundColor = "#ddd";
    jakobSpeedMultiplier = 1;
    dashActive = false;
    lastDashTime = 0;
    startTimer();

    // Level-spezifische Änderungen anwenden
    if (gameMode === "showdown") {
        if (level === 2) {
            hochstrasserSpeed = jakobSpeed * 1.25;
        } else if (level === 3) {
            hochstrasserSpeed = jakobSpeed * 1.5;
            createObstacles();
        } else if (level === 4) {
            hochstrasserSpeed = jakobSpeed * 1.75;
            hochstrasserRadius = jakobRadius * 3;
            obstacleCount = 8;
            createObstacles();
        }
    }

    createOrbs();
}

// ... (Rest des Spielcodes) ...

// Leaderboard-Funktionalität
const showLeaderboardButton = document.getElementById("showLeaderboard");
const leaderboard = document.getElementById("leaderboard");
const leaderboardTableBody = document.querySelector("#leaderboardTable tbody");
const backToGameLeaderboardButton = document.getElementById("backToGameLeaderboard");
const levelSelect = document.getElementById("levelSelect");

let levelTimes = JSON.parse(localStorage.getItem("levelTimes")) || {};
let startTime;

showLeaderboardButton.addEventListener("click", () => {
    userDropdown.style.display = "none";
    leaderboard.style.display = "block";
    displayLeaderboard();
});

backToGameLeaderboardButton.addEventListener("click", () => {
    leaderboard.style.display = "none";
});

function displayLeaderboard() {
    // Erstelle Dropdown-Optionen für alle Level (maximal bis zum aktuellen Level)
    levelSelect.innerHTML = "";
    for (let i = 1; i <= level; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Level ${i}`;
        levelSelect.appendChild(option);
    }

    // Zeige das Leaderboard für das ausgewählte Level an
    showLevelTimes(levelSelect.value);

    // Event-Listener für Level-Auswahl
    levelSelect.addEventListener("change", () => {
        showLevelTimes(levelSelect.value);
    });
}

function showLevelTimes(level) {
    const times = levelTimes[level] || [];
    times.sort((a, b) => a.time - b.time);

    leaderboardTableBody.innerHTML = "";
    times.slice(0, 10).forEach((entry, index) => {
        const row = document.createElement("tr");
        const rank = document.createElement("td");
        const username = document.createElement("td");
        const time = document.createElement("td");

        rank.textContent = index + 1;
        username.textContent = entry.username;
        time.textContent = formatTime(entry.time);

        row.appendChild(rank);
        row.appendChild(username);
        row.appendChild(time);
        leaderboardTableBody.appendChild(row);
    });
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Starte die Zeitmessung beim Level-Start
function startTimer() {
    startTime = Date.now();
}

// Stoppe die Zeitmessung und speichere die Zeit beim Level-Abschluss
function stopTimer() {
    if (startTime) {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        const level = currentUser.level;

        if (!levelTimes[level]) {
            levelTimes[level] = [];
        }

        levelTimes[level].push({
            username: currentUser.username || currentUser.email,
            time: elapsedTime
        });

        localStorage.setItem("levelTimes", JSON.stringify(levelTimes));
    }
}

// ... (Rest des Spielcodes) ...

// Level-Reset-Funktion aktualisieren
function resetGame() {
    // ... (vorheriger Code) ...
    startTimer();
    // ... (vorheriger Code) ...
}

// Spielschleife aktualisieren
function gameLoop() {
    // ... (vorheriger Code) ...
    if (win) {
        // ... (vorheriger Code) ...
        stopTimer();
        nextLevelButton.addEventListener("click", () => {
            level++;
            saveLevelProgress();
            resetGame();
            gameLoop();
            nextLevelButton.remove();
        });
        document.getElementById("game-container").appendChild(nextLevelButton);
    }
    // ... (vorheriger Code) ...
}

// Login- und Registrierungsfunktionalität
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showLoginForm = document.getElementById("showLoginForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const loginEmailUsernameInput = document.getElementById("loginEmailUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const registerEmailInput = document.getElementById("registerEmail");
const registerUsernameInput = document.getElementById("registerUsername");
const registerPasswordInput = document.getElementById("registerPassword");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const loggedInUserDisplay = document.getElementById("loggedInUser");
const formArea = document.getElementById("formArea");
const userDropdown = document.getElementById("userDropdown");
const showLevelsButton = document.getElementById("showLevels");
const levelDisplay = document.getElementById("levelDisplay");
const levelList = document.getElementById("levelList");
const backToGameButton = document.getElementById("backToGame");

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

showLoginForm.addEventListener("click", () => {
    loginForm.style.display = "block";
    showLoginForm.style.display = "none";
    formArea.style.display = 'block';
});

showRegister.addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

showLogin.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

registerButton.addEventListener("click", () => {
    const email = registerEmailInput.value;
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;

    if (users.find(user => user.email === email || user.username === username)) {
        alert("E-Mail oder Benutzername bereits vorhanden.");
        return;
    }

    const newUser = { email, username, password, level: 1 };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registrierung erfolgreich.");
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

loginButton.addEventListener("click", () => {
    const emailUsername = loginEmailUsernameInput.value;
    const password = loginPasswordInput.value;
    const user = users.find(user => user.email === emailUsername || user.username === emailUsername);

    if (user && user.password === password) {
        currentUser = user;
        alert("Login erfolgreich.");
        loginForm.style.display = "none";
        level = currentUser.level;
        resetGame();
        gameLoop();
        loggedInUserDisplay.textContent = `Eingeloggt als: ${currentUser.username || currentUser.email}`;
        loggedInUserDisplay.style.display = "block";
        formArea.style.display = 'none';
    } else {
        alert("Falsche E-Mail/Benutzername oder Passwort.");
    }
});

loggedInUserDisplay.addEventListener("click", () => {
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
});

showLevelsButton.addEventListener("click", () => {
    userDropdown.style.display = "none";
    levelDisplay.style.display = "block";
    displayLevels();
});

backToGameButton.addEventListener("click", () => {
    levelDisplay.style.display = "none";
});

function displayLevels() {
    levelList.innerHTML = "";
    for (let i = 1; i <= currentUser.level; i++) {
        const levelItem = document.createElement("li");
        levelItem.textContent = `Level ${i}`;
        levelList.appendChild(levelItem);
    }
}

// ... (Rest des Spielcodes)

// Level-Speicherfunktion aktualisieren
function saveLevelProgress() {
    if (currentUser) {
        currentUser.level = level;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

// Level-Ladefunktion aktualisieren
function loadLevelProgress() {
    if (currentUser) {
        level = currentUser.level;
    }
}

// Spiel-Reset-Funktion aktualisieren
function resetGame() {
    // ... (vorheriger Code)
    loadLevelProgress(); // Lade den Level beim Spielstart
    // ... (vorheriger Code)
}

// Spielschleife aktualisieren
function gameLoop() {
    // ... (vorheriger Code)
    if (win) {
        // ... (vorheriger Code)
        nextLevelButton.addEventListener("click", () => {
            level++;
            saveLevelProgress(); // Speichere den Level beim Level-Abschluss
            resetGame();
            gameLoop();
            nextLevelButton.remove();
        });
        document.getElementById("game-container").appendChild(nextLevelButton);
    }
    // ... (vorheriger Code)
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jakobSizeDisplay = document.getElementById("jakobSize");
const hochstrasserSizeDisplay = document.getElementById("hochstrasserSize");
const replayButton = document.getElementById("replayButton");
const gameMessage = document.getElementById("game-message");
const level2Button = document.createElement("button");
level2Button.textContent = "Level 2";
level2Button.style.position = "absolute";
level2Button.style.top = "60px";
level2Button.style.left = "50%";
level2Button.style.transform = "translateX(-50%)";
level2Button.style.display = "none";
document.getElementById("game-container").appendChild(level2Button);

const level3Button = document.createElement("button");
level3Button.textContent = "Level 3";
level3Button.style.position = "absolute";
level3Button.style.top = "100px";
level3Button.style.left = "50%";
level3Button.style.transform = "translateX(-50%)";
level3Button.style.display = "none";
document.getElementById("game-container").appendChild(level3Button);

const level4Button = document.createElement("button");
level4Button.textContent = "Level 4";
level4Button.style.position = "absolute";
level4Button.style.top = "140px";
level4Button.style.left = "50%";
level4Button.style.transform = "translateX(-50%)";
level4Button.style.display = "none";
document.getElementById("game-container").appendChild(level4Button);

const level5Button = document.createElement("button");
level4Button.textContent = "Level 5";
level4Button.style.position = "absolute";
level4Button.style.top = "180px";
level4Button.style.left = "50%";
level4Button.style.transform = "translateX(-50%)";
level4Button.style.display = "none";
document.getElementById("game-container").appendChild(level4Button);

const restartLevel1Button = document.createElement("button");
restartLevel1Button.textContent = "Restart from Level 1";
restartLevel1Button.style.position = "absolute";
restartLevel1Button.style.top = "180px";
restartLevel1Button.style.left = "50%";
restartLevel1Button.style.transform = "translateX(-50%)";
restartLevel1Button.style.display = "none";
document.getElementById("game-container").appendChild(restartLevel1Button);

// Level-Auswahl-Element erstellen
const levelSelection = document.createElement("div");
levelSelection.style.position = "absolute";
levelSelection.style.top = "20px";
levelSelection.style.right = "20px";
levelSelection.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
levelSelection.style.padding = "10px";
levelSelection.style.borderRadius = "5px";
levelSelection.style.color = "white";
document.getElementById("game-container").appendChild(levelSelection);

// Level-Auswahl-Buttons erstellen
for (let i = 1; i <= 4; i++) {
    const levelButton = document.createElement("button");
    levelButton.textContent = `Level ${i}`;
    levelButton.style.display = "block";
    levelButton.style.marginBottom = "5px";
    levelButton.addEventListener("click", () => {
        if (i > level + 1) {
            // Fehlermeldung anzeigen
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Dieses Level haben Sie noch nicht freigeschaltet.";
            errorMessage.style.position = "absolute";
            errorMessage.style.top = "50%";
            errorMessage.style.left = "50%";
            errorMessage.style.transform = "translate(-50%, -50%)";
            errorMessage.style.backgroundColor = "red";
            errorMessage.style.color = "white";
            errorMessage.style.padding = "10px";
            errorMessage.style.borderRadius = "5px";
            document.body.appendChild(errorMessage);

            // Fehlermeldung nach 5 Sekunden entfernen
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        } else {
            level = i;
            resetGame();
            gameLoop();
        }
    });
    levelSelection.appendChild(levelButton);
}

// Farben
const JAKOB_COLOR = "blue";
const HOCHSTRASSER_COLOR = "red";
const GREEN_ORB_COLOR = "green";
const VIOLET_ORB_COLOR = "violet";
const GRAY_ORB_COLOR = "gray";
const YELLOW_ORB_COLOR = "yellow";
const BEIGE_ORB_COLOR = "beige";
const BLACK_ORB_COLOR = "black";
const SPEED_ORB_COLOR = "orange";
const OBSTACLE_COLOR = "black";

const TEXT_COLOR = "white";

// Jakob-Figur (Kreis)
let jakobRadius;
let jakobX;
let jakobY;
let jakobSpeed = 5; // Jakob's Geschwindigkeit wurde reduziert
let jakobSpeedMultiplier = 1; // Multiplikator für Jakob's Geschwindigkeit
let lastWPressTime = 0; // Zeitpunkt des letzten W-Drucks
let dashActive = false; // Status des Dash-Boosts
let dashDuration = 1000; // Dauer des Dash-Boosts in Millisekunden
let dashStartTime = 0; // Zeitpunkt des Dash-Boost-Starts
let dashCooldown = 10000; // 10 Sekunden Abklingzeit
let lastDashTime = 0; // Zeitpunkt des letzten Dash-Einsatzes

// Hochstrasser (roter Kreis)
let hochstrasserRadius;
let hochstrasserX;
let hochstrasserY;
let hochstrasserSpeed;
let hochstrasserDirectionX;
let hochstrasserDirectionY;

// Orbs
let orbs;
const orbCount = 10;

// Hindernisse
let obstacles;
let obstacleCount = 5;

// Tastenstatus
const keys = {};

// Spielstatus
let gameOver = false;
let win = false;
let level = 1;

function resetGame() {
    // Standardwerte zurücksetzen
    jakobRadius = 25;
    jakobX = Math.random() * canvas.width;
    jakobY = Math.random() * canvas.height;
    hochstrasserRadius = jakobRadius * 2; // Standardgröße für Hochstrasser
    hochstrasserX = Math.random() * canvas.width;
    hochstrasserY = Math.random() * canvas.height;
    hochstrasserSpeed = jakobSpeed * 1; // Standardgeschwindigkeit für Hochstrasser
    hochstrasserDirectionX = (Math.random() - 0.5) * 2;
    hochstrasserDirectionY = (Math.random() - 0.5) * 2;
    orbs = [];
    obstacleCount = 5;
    obstacles = [];
    gameOver = false;
    win = false;
    gameMessage.style.display = "none";
    level2Button.style.display = "none";
    level3Button.style.display = "none";
    level4Button.style.display = "none";
    restartLevel1Button.style.display = "none";
    canvas.style.backgroundColor = "#ddd";
    jakobSpeedMultiplier = 1;
    dashActive = false;
    lastDashTime = 0;

    // Level-spezifische Änderungen anwenden
    if (level === 2) {
        hochstrasserSpeed = jakobSpeed * 1.25;
    } else if (level === 3) {
        hochstrasserSpeed = jakobSpeed * 1.5;
        createObstacles();
    } else if (level === 4) {
        hochstrasserSpeed = jakobSpeed * 1.75;
        hochstrasserRadius = jakobRadius * 3;
        obstacleCount = 8;
        createObstacles();
    }

    createOrbs();
}

function createOrbs() {
    orbs = [];
    for (let i = 0; i < orbCount; i++) {
        let orb;
        let validPosition = false;
        let attempts = 0;

        while (!validPosition && attempts < 100) {
            const randomValue = Math.random();
            let orbColor = GREEN_ORB_COLOR;
            let orbSizeIncrease = 0.01;
            let orbShape = "circle";

            // Orb Farben können nun auf allen Levels spawnen
            if (randomValue < 0.15) {
                orbColor = VIOLET_ORB_COLOR;
                orbSizeIncrease = 0.02;
            } else if (randomValue < 0.35) {
                orbColor = GRAY_ORB_COLOR;
                orbSizeIncrease = 0.05;
            } else if (randomValue < 0.75) {
                orbColor = YELLOW_ORB_COLOR;
                orbSizeIncrease = 0.1;
            } else if (randomValue < 1 / 75) {
                orbColor = BEIGE_ORB_COLOR;
                orbSizeIncrease = 1;
            } else if (randomValue < 1 / 23) {
                orbColor = SPEED_ORB_COLOR;
                orbShape = "triangle";
            } else if (randomValue < 1 / 100) {
                orbColor = BLACK_ORB_COLOR;
                orbSizeIncrease = 5;
            }

            orb = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: orbColor === BLACK_ORB_COLOR ? 65 : Math.floor(Math.random() * 11) + 10,
                color: orbColor,
                sizeIncrease: orbSizeIncrease,
                shape: orbShape,
            };

            // Überprüfe, ob der Orb mit einem Hindernis kollidiert
            if (level === 3 || level === 4) {
                let collision = false;
                obstacles.forEach((obstacle) => {
                    if (orb.x + orb.radius > obstacle.x &&
                        orb.x - orb.radius < obstacle.x + obstacle.width &&
                        orb.y + orb.radius > obstacle.y &&
                        orb.y - orb.radius < obstacle.y + obstacle.height) {
                        collision = true;
                    }
                });

                if (!collision) {
                    validPosition = true;
                }
            } else {
                validPosition = true;
            }

            attempts++;
        }

        orbs.push(orb);
    }
}

function createObstacles() {
    obstacles = [];
    for (let i = 0; i < obstacleCount; i++) {
        obstacles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.floor(Math.random() * 50) + 20,
            height: Math.floor(Math.random() * 50) + 20,
        });
    }
}

resetGame();

// Spielschleife
function gameLoop() {
    if (gameOver || win) return;

    let newJakobX = jakobX;
    let newJakobY = jakobY;
    if (keys["w"]) {
        const currentTime = Date.now();
        if (currentTime - lastWPressTime < 200 && currentTime - lastDashTime > dashCooldown) { // Doppelklick-Zeitfenster: 200 Millisekunden
            dashActive = true;
            dashStartTime = currentTime;
            jakobSpeedMultiplier = 1.4; // Geschwindigkeitsboost: +0.4x
            newJakobY -= jakobSpeed * 2; // Kleiner Katapulteffekt
            lastDashTime = currentTime;
        }
        lastWPressTime = currentTime;
        newJakobY -= jakobSpeed * jakobSpeedMultiplier;
    }
    if (keys["s"]) newJakobY += jakobSpeed * jakobSpeedMultiplier;
    if (keys["a"]) newJakobX -= jakobSpeed * jakobSpeedMultiplier;
    if (keys["d"]) newJakobX += jakobSpeed * jakobSpeedMultiplier;

    if (dashActive && Date.now() - dashStartTime > dashDuration) {
        dashActive = false;
        jakobSpeedMultiplier = 1; // Geschwindigkeit auf Normal zurücksetzen
    }

    let jakobCollides = false;
    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            if (newJakobX + jakobRadius > obstacle.x &&
                newJakobX - jakobRadius < obstacle.x + obstacle.width &&
                newJakobY + jakobRadius > obstacle.y &&
                newJakobY - jakobRadius < obstacle.y + obstacle.height) {
                jakobCollides = true;
            }
        });
    }

    if (!jakobCollides) {
        jakobX = newJakobX;
        jakobY = newJakobY;
    }

    hochstrasserX += hochstrasserDirectionX * hochstrasserSpeed;
    hochstrasserY += hochstrasserDirectionY * hochstrasserSpeed;

    let hochstrasserCollides = false;
    let collisionSide = null; // Speichert die Kollisionsseite (top, bottom, left, right)

    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            if (hochstrasserX + hochstrasserRadius > obstacle.x &&
                hochstrasserX - hochstrasserRadius < obstacle.x + obstacle.width &&
                hochstrasserY + hochstrasserRadius > obstacle.y &&
                hochstrasserY - hochstrasserRadius < obstacle.y + obstacle.height) {
                hochstrasserCollides = true;

                // Bestimme die Kollisionsseite
                const dx = hochstrasserX - (obstacle.x + obstacle.width / 2);
                const dy = hochstrasserY - (obstacle.y + obstacle.height / 2);
                const width = (obstacle.width + hochstrasserRadius) / 2;
                const height = (obstacle.height + hochstrasserRadius) / 2;
                const crossWidth = width * dy;
                const crossHeight = height * dx;

                if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
                    if (crossWidth > crossHeight) {
                        collisionSide = (crossWidth > -crossHeight) ? "bottom" : "left";
                    } else {
                        collisionSide = (crossWidth > -crossHeight) ? "right" : "top";
                    }
                }
            }
        });
    }

    if (hochstrasserCollides) {
        // Hochstrasser prallt ab, basierend auf der Kollisionsseite
        if (collisionSide === "left" || collisionSide === "right") {
            hochstrasserDirectionX *= -1;
        }
        if (collisionSide === "top" || collisionSide === "bottom") {
            hochstrasserDirectionY *= -1;
        }
    } else {
        hochstrasserX += hochstrasserDirectionX * hochstrasserSpeed;
        hochstrasserY += hochstrasserDirectionY * hochstrasserSpeed;
    }

    if (hochstrasserX < 0 || hochstrasserX > canvas.width) {
        hochstrasserDirectionX *= -1;
    }
    if (hochstrasserY < 0 || hochstrasserY > canvas.height) {
        hochstrasserDirectionY *= -1;
    }

    if (level !== 3 && level !== 4) {
        for (let i = orbs.length - 1; i >= 0; i--) {
            const orb = orbs[i];
            const dxHochstrasser = hochstrasserX - orb.x;
            const dyHochstrasser = hochstrasserY - orb.y;
            const distanceHochstrasser = Math.sqrt(dxHochstrasser * dxHochstrasser + dyHochstrasser * dyHochstrasser);

            if (distanceHochstrasser < hochstrasserRadius + orb.radius) {
                orbs.splice(i, 1);
                hochstrasserRadius += hochstrasserRadius * orb.sizeIncrease;
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = JAKOB_COLOR;
    ctx.beginPath();
    ctx.arc(jakobX, jakobY, jakobRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "20px Arial";
    ctx.fillText("Jakob", jakobX - 20, jakobY - jakobRadius - 10);

    ctx.fillStyle = HOCHSTRASSER_COLOR;
    ctx.beginPath();
    ctx.arc(hochstrasserX, hochstrasserY, hochstrasserRadius, 0, Math.PI * 2);
    ctx.fill();

    orbs.forEach((orb) => {
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        if (orb.shape === "triangle") {
            ctx.moveTo(orb.x, orb.y - orb.radius);
            ctx.lineTo(orb.x + orb.radius, orb.y + orb.radius);
            ctx.lineTo(orb.x - orb.radius, orb.y + orb.radius);
        } else {
            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        }
        ctx.fill();
    });

    if (level === 3 || level === 4) {
        obstacles.forEach((obstacle) => {
            ctx.fillStyle = OBSTACLE_COLOR;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    const dx = jakobX - hochstrasserX;
    const dy = jakobY - hochstrasserY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < hochstrasserRadius && hochstrasserRadius > jakobRadius) {
        gameOver = true;
    }

    if (distance < jakobRadius && jakobRadius > hochstrasserRadius) {
        win = true;
    }

    for (let i = orbs.length - 1; i >= 0; i--) {
        const orb = orbs[i];
        const dxOrb = jakobX - orb.x;
        const dyOrb = jakobY - orb.y;
        const distanceOrb = Math.sqrt(dxOrb * dxOrb + dyOrb * dyOrb);

        if (distanceOrb < jakobRadius + orb.radius) {
            orbs.splice(i, 1);
            if (orb.color === SPEED_ORB_COLOR) {
                jakobSpeedMultiplier += 0.1;
            } else if (orb.color === BLACK_ORB_COLOR && jakobRadius > orb.radius) {
                jakobRadius *= 6;
            } else if (orb.color !== BLACK_ORB_COLOR) {
                jakobRadius += jakobRadius * orb.sizeIncrease;
            }
            orbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.floor(Math.random() * 11) + 10,
                color: GREEN_ORB_COLOR,
                sizeIncrease: 0.01,
                shape: "circle",
            });
        }
    }

    if (level === 4) {
        for (let i = orbs.length - 1; i >= 0; i--) {
            const orb = orbs[i];
            const dxOrb = hochstrasserX - orb.x;
            const dyOrb = hochstrasserY - orb.y;
            const distanceOrb = Math.sqrt(dxOrb * dxOrb + dyOrb * dyOrb);

            if (distanceOrb < hochstrasserRadius + orb.radius) {
                orbs.splice(i, 1);
                if (orb.color === BLACK_ORB_COLOR && hochstrasserRadius > 100) {
                    hochstrasserRadius *= 6;
                } else if (orb.color !== BLACK_ORB_COLOR) {
                    hochstrasserRadius += hochstrasserRadius * orb.sizeIncrease;
                }
            }
        }
    }

    if (orbs.length === 0) {
        for (let i = 0; i < 15; i++) {
            orbs.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.floor(Math.random() * 11) + 10,
                color: GREEN_ORB_COLOR,
                sizeIncrease: 0.01,
                shape: "circle",
            });
        }
    }

    if (gameOver) {
        canvas.style.backgroundColor = "red";
        gameMessage.textContent = "Tot.";
        gameMessage.style.display = "block";
        if (level === 2 || level === 3 || level === 4) {
            restartLevel1Button.style.display = "block";
        }
    } else if (win) {
        canvas.style.backgroundColor = "green";
        gameMessage.textContent = "Gut.";
        gameMessage.style.display = "block";
        if (level === 1) {
            level2Button.style.display = "block";
        } else if (level === 2) {
            level3Button.style.display = "block";
        } else if (level === 3) {
            level4Button.style.display = "block";
        }
        // "Nächstes Level"-Button hinzufügen
        if (level < 4) {
            const nextLevelButton = document.createElement("button");
            nextLevelButton.textContent = `Nächstes Level (${level + 1})`;
            nextLevelButton.style.position = "absolute";
            nextLevelButton.style.top = "220px";
            nextLevelButton.style.left = "50%";
            nextLevelButton.style.transform = "translateX(-50%)";
            nextLevelButton.addEventListener("click", () => {
                level++;
                resetGame();
                gameLoop();
                nextLevelButton.remove(); // Button nach Klick entfernen
            });
            document.getElementById("game-container").appendChild(nextLevelButton);
        }
    }

    jakobSizeDisplay.textContent = `Jakob: ${Math.floor(jakobRadius)}`;
    hochstrasserSizeDisplay.textContent = `Hochstrasser: ${Math.floor(hochstrasserRadius)}`;

    // Steuerungshinweise hinzufügen
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "16px Arial";
    ctx.fillText("Steuerung:", 10, 20);
    ctx.fillText("W: Vorwärts (Doppeltipp: Dash)", 10, 40);
    ctx.fillText("S: Rückwärts", 10, 60);
    ctx.fillText("A: Links", 10, 80);
    ctx.fillText("D: Rechts", 10, 100);

    // Dash-Cooldown-Anzeige hinzufügen
    if (Date.now() - lastDashTime < dashCooldown) {
        const remainingCooldown = Math.ceil((dashCooldown - (Date.now() - lastDashTime)) / 1000);
        ctx.fillText(`Dash Cooldown: ${remainingCooldown}s`, 10, 120);
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

replayButton.addEventListener("click", () => {
    resetGame();
    gameLoop();
});

level2Button.addEventListener("click", () => {
    level = 2;
    resetGame();
    gameLoop();
});

level3Button.addEventListener("click", () => {
    level = 3;
    resetGame();
    gameLoop();
});

level4Button.addEventListener("click", () => {
    level = 4;
    resetGame();
    gameLoop();
});

restartLevel1Button.addEventListener("click", () => {
    level = 1;
    resetGame();
    gameLoop();
});

gameLoop();
