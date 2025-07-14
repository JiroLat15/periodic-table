// Grab the container div from the HTML
const tableContainer = document.getElementById("table-container");

// Set up 7 rows and 18 columns (the main periodic table)
const rows = 9; // Periods 1-7 + 2 extra for Lanthanides (8) and Actinides (9)
const cols = 18; // Only 18 groups, keep this consistent
const table = [];

// Initialize all cells to null
for (let i = 0; i < rows; i++) {
    table[i] = new Array(cols).fill(null);
}

// Seperate arrays for Lanthanides and Actinides
const lanthanides = [];
const actinides = [];

// Place each element in its correct position based on period & group
elements.forEach((el) => {
    if (el.isLanthanide) {
        lanthanides.push(el); // add to lanthanide list
    } else if (el.isActinide) {
        actinides.push(el);   // add to actinide list
    } else {
        const row = el.period - 1;
        const col = el.group - 1;
        table[row][col] = el; // place in the main table
    }
});

// Manually place Lanthanides in Period 8 (index 7), starting at Group 4 (index 3 + 1 = 4)
lanthanides.forEach((el, i) => {
    table[7][i + 3] = el; // starts at column index 4
});

// Manually place Actinides in Period 9 (index 8), starting at Group 4 (index 3 + 1 = 4)
actinides.forEach((el, i) => {
    table[8][i + 3] = el;
});

// Create the main periodic table
const htmlTable = document.createElement("table");
htmlTable.classList.add("periodic-table");

// Add colgroup to define column widths
const colGroup = document.createElement("colgroup");
for (let i = 0; i < cols + 1; i++) {  // +1 for the gap column
    const col = document.createElement("col");

    // If we're at Group 3's position (index 3), insert a special class
    if (i === 3) {
        const gapCol = document.createElement("col");
        gapCol.classList.add("gap-col");
        colGroup.appendChild(gapCol);
    }

    colGroup.appendChild(col);
}
htmlTable.appendChild(colGroup);

// Build rows
for (let rowIndex = 0; rowIndex < table.length; rowIndex++) {
    // 👇 Insert a row spacer after Period 7 (index 6)
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
        // Insert gap after Group 3 (colIndex 3)
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
        } else {
            td.classList.add("empty");
        }

        tr.appendChild(td);
    }

    htmlTable.appendChild(tr);
}

// Append final table to container
tableContainer.appendChild(htmlTable);
