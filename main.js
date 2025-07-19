const tableContainer = document.getElementById("table-container");

const rows = 9;
const cols = 18;
const table = [];

for (let i = 0; i < rows; i++) {
    table[i] = new Array(cols).fill(null);
}

const lanthanides = [];
const actinides = [];

elements.forEach((el) => {
    if (el.isLanthanide) {
        lanthanides.push(el);
    } else if (el.isActinide) {
        actinides.push(el);
    } else {
        const row = el.period - 1;
        const col = el.group - 1;
        table[row][col] = el;
    }
});

lanthanides.forEach((el, i) => {
    table[7][i + 3] = el;
});

actinides.forEach((el, i) => {
    table[8][i + 3] = el;
});

const htmlTable = document.createElement("table");
htmlTable.classList.add("periodic-table");

const colGroup = document.createElement("colgroup");
for (let i = 0; i < cols + 1; i++) { 
    const col = document.createElement("col");

    if (i === 3) {
        const gapCol = document.createElement("col");
        gapCol.classList.add("gap-col");
        colGroup.appendChild(gapCol);
    }

    colGroup.appendChild(col);
}
htmlTable.appendChild(colGroup);

for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {

    if (rowIndex === 7) {
        const spacerTr = document.createElement("tr");
        const spacerTd = document.createElement("td");
        spacerTd.colSpan = cols + 1;
        spacerTd.classList.add("row-space");
        spacerTr.appendChild(spacerTd);
        htmlTable.appendChild(spacerTr);
    }

    const tr = document.createElement("tr");

    for (let colIndex = 0; colIndex < cols; colIndex++) {

        if (colIndex === 3) {
            const gapTd = document.createElement("td");
            gapTd.classList.add("gap-cell");
            tr.appendChild(gapTd);
        }

        const cell = table[rowIndex][colIndex];
        const td = document.createElement("td");

        if (cell) {
            td.innerHTML = `
                <div class="atomic-number">${cell.number}</div>
                <div class="symbol">${cell.symbol}</div>
                <div class="element-name">${cell.name}</div>
            `;

            if (cell.category) {
                td.classList.add(cell.category);
            }
        } 
        
        else {
            td.classList.add("empty");
        }

        tr.appendChild(td);
    }

    htmlTable.appendChild(tr);
}

tableContainer.appendChild(htmlTable);

// Add this at the bottom of your main.js or inside a DOMContentLoaded event

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Default theme
body.classList.add("light-mode");
themeToggle.textContent = "🌙";

themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode", !isDark);
    themeToggle.textContent = isDark ? "☀️" : "🌙";
});