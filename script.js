// ---------- initializing part -------------
const winArray = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];

let playingMode = "pvsp"; //default is pvsp
let computerTurn = "O"; //default is O
let turn = "X"; // default is X
let userTurn = "";
let isFinished = false;

const reset = document.querySelector(".reset");
const cells = document.querySelectorAll(".box");
const pvsp = document.querySelector(".pvsp");
const pvsc = document.querySelector(".pvsc");
const sideText = document.querySelector(".sideText");
const side = document.querySelector(".side");
const mode = document.querySelector(".mode");
const xo = document.querySelectorAll(".xo");
const turnDiv = document.querySelector(".turn");
const result = document.querySelector(".result");

xo.forEach((item) => {
    // handle turn selection
    item.addEventListener("click", (event) => {
        turn = event.target.innerText.toUpperCase();
        turn === "X" ? (computerTurn = "O") : (computerTurn = "X");
        computerTurn === "X" ? (userTurn = "O") : (userTurn = "X");
        side.style.display = "none";
        main();
    });
});

reset.addEventListener("click", () => {
    window.location.reload();
});

pvsp.addEventListener("click", () => {
    playingMode = "pvsp";
    sideText.innerText = "Who is gonna start ? (default is x)";
    side.style.display = "flex";
    mode.style.display = "none";
});
pvsc.addEventListener("click", () => {
    playingMode = "pvsc";
    sideText.innerText = "Select your side : (default is x)";
    side.style.display = "flex";
    mode.style.display = "none";
});

// ------------------ logic part ---------------

function main() {
    if (playingMode === "pvsp") {
        playerVsPlayerHandler();
    } else {
        playerVsComputerHandler();
    }
}

function playerVsPlayerHandler() {
    turnDiv.innerText = `${turn} turn`;
    cells.forEach((cell) => {
        cell.addEventListener("click", clickHandler);
    });
}

async function playerVsComputerHandler() {
    while (!isFinished) {
        await playerTurnHandler();
        if (!isFinished) {
            await computerTurnHandler();
        }
    }
}

function playerTurnHandler() {
    return new Promise((resolve, reject) => {
        try {
            cells.forEach((item) =>
                item.addEventListener("click", (e) => {
                    if (!isFinished) {
                        e.target.innerText = userTurn;
                        isWin();
                        resolve();
                    }
                })
            );
        } catch {
            reject("Error Occured");
        }
    });
}

function computerTurnHandler() {
    return new Promise((resolve, reject) => {
        try {
            if (findAll(computerTurn).length === 0) {
                //this is first move
                if (isEmpty("c5")) {
                    fillCell("c5");
                } else {
                    fillCell("c7");
                }
            } else {
                let comWinChance = winChance("computer");
                let usrWinChance = winChance("user");
                if (comWinChance.length) {
                    for (let j = 0; j < 3; j++) {
                        if (isEmpty(`c${comWinChance[0][j]}`)) {
                            fillCell(`c${comWinChance[0][j]}`);
                        }
                    }
                } else if (usrWinChance.length) {
                    for (let j = 0; j < 3; j++) {
                        if (isEmpty(`c${usrWinChance[0][j]}`)) {
                            fillCell(`c${usrWinChance[0][j]}`);
                        }
                    }
                } else {
                    const emptyCells = isEmpty();
                    const rnd = Math.floor(Math.random() * emptyCells.length);
                    console.log(emptyCells[rnd]);
                    fillCell(emptyCells[rnd]);
                }
            }
            isWin();
            resolve();
        } catch {
            reject();
        }
    });
}

// /-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|/-\|
function clickHandler(e) {
    if (!isFinished && isEmpty(e.target.id)) {
        e.target.innerText = turn;
        isWin();
        turn === "X" ? (turn = "O") : (turn = "X");
        turnDiv.innerText = `${turn} turn`;
    }
}

function changeTurnHandler() {
    turn === "X" ? (turn = "O") : (turn = "X");
    main();
}

function fillCell(cl) {
    document.getElementById(cl).innerText = computerTurn;
}

function isWin() {
    const allX = findAll("X");
    const allO = findAll("O");
    let winner;
    winArray.forEach((array) => {
        if (compare(array, allO)[0]) {
            isFinished = true;
            winner = "O";
            console.log("o barande");
        } else if (compare(array, allX)[0]) {
            isFinished = true;
            winner = "X";
            console.log("x barande");
        } else if (!isEmpty().length) {
            isFinished = true;
            winner = "-";
        }
    });

    if (isFinished) {
        turnDiv.style.display = "none";
        result.innerText = winner === "-" ? `It's a Draw` : `${winner} Won`;
        reset.style.display = "block";
        cells.forEach((cell) => {
            cell.removeEventListener("click", clickHandler);
            cell.removeEventListener("click", changeTurnHandler);
        });
    } else {
        return;
    }
}

function compare(arr1, arr2) {
    let counter = 0;
    arr1.forEach((e1) => {
        arr2.forEach((e2) => {
            if (e1 === e2) {
                counter = counter + 1;
            }
        });
    });
    if (counter > 2) {
        return [true, 0];
    } else if (counter === 2) {
        return [false, arr1];
    }
    return [false, 0];
}

function findAll(XO) {
    let all = [];
    cells.forEach((cell) => {
        if (cell.innerText === XO) {
            all.push(Number(cell.id[1]));
        }
    });
    return all;
}

function winChance(user) {
    const allCell =
        user === "computer" ? findAll(computerTurn) : findAll(userTurn);
    const arr = winArray.filter((row) => compare(row, allCell)[1] != 0);
    if (arr.length != 0) {
        let result = [];
        arr.forEach((row) => {
            // change to arr.some()
            if (
                isEmpty(`c${row[0]}`) ||
                isEmpty(`c${row[1]}`) ||
                isEmpty(`c${row[2]}`)
            ) {
                result.push(row);
            }
        });
        return result;
    }
    return [];
}

function isEmpty(cell = false) {
    console.log(`checking ${cell}`);
    if (cell) {
        if (document.getElementById(cell).innerText == "") {
            return true;
        } else {
            return false;
        }
    } else {
        let emptyCells = [];
        for (let key in cells) {
            if (cells[key].innerText === "") emptyCells.push(cells[key].id);
        }
        return emptyCells;
    }
}
