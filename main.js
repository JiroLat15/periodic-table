// Grab the container div from the HTML
const tableContainer = document.getElementById("table-container");

// Set up 7 rows and 18 columns (the main periodic table)
const rows = 7;
const cols = 18
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
    }

    else if (el.isActinide) {
        actinides.push(el);   // add to actinide list
    }

    else {
        const row = el.period - 1;
        const col = el.group - 1;
        table[row][col] = el; // place in the main table
    }
});

// Create the main periodic table
const htmlTable = document.createElement("table");
htmlTable.classList.add("periodic-table");

table.forEach((row) => {
    const tr = document.createElement("tr");

    row.forEach((cell, colIndex) => {
        const td = document.createElement("td");

        if (cell) {
            // If there is an element in this cell
            td.classList.add(`group-${cell.group}`);
            td.innerHTML = `
                <div class="atomic-number">${cell.number}</div>
                <div class="symbol">${cell.symbol}</div>
                <div class="element-name">${cell.name}</div>
            `;
        } 
        
        else {
            // If it's empty
            td.classList.add("empty");
        }

        tr.appendChild(td);

        // Add visual spacer after Group 3 (which is at index 2)
        if (colIndex === 2) {
            const gap = document.createElement("td");
            gap.classList.add("gap-cell");
            tr.appendChild(gap);
        }
    });

    htmlTable.appendChild(tr);
});

tableContainer.appendChild(htmlTable); // Add main table to HTML

// Function to build Lanthanide or Actinide row
function createSeriesRow(title, elementsList) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("element-series-wrapper");

    // const label = document.createElement("div");
    // label.classList.add("element-series-label");
    // label.textContent = title;

    // Create table-like structure
    const table = document.createElement("table");
    table.classList.add("series-table");

    const tr = document.createElement("tr");

    // Add empty cells to simulate offset (first 3 groups)
    // NEW: Offset by 3 empty + 1 gap to align with group 4
    for (let i = 0; i < 3; i++) {
        const emptyTd = document.createElement("td");
        emptyTd.classList.add("empty");
        tr.appendChild(emptyTd);
    }

    // Add the spacing between group 3 and 4
        const gapTd = document.createElement("td");
        gapTd.classList.add("gap-cell");
        tr.appendChild(gapTd);

    // Add the 15 elements
    elementsList.forEach((el) => {
        const td = document.createElement("td");

        td.innerHTML = `
            <div class="atomic-number">${el.number}</div>
            <div class="symbol">${el.symbol}</div>
            <div class="element-name">${el.name}</div>
        `;

        tr.appendChild(td);
    });

    table.appendChild(tr);
    // wrapper.appendChild(label);
    wrapper.appendChild(table);

    return wrapper;
}

// Create and append the Lanthanide and Actinide rows
const lanthanideRow = createSeriesRow("Lanthanides", lanthanides);
const actinideRow = createSeriesRow("Actinides", actinides);

tableContainer.appendChild(lanthanideRow);
tableContainer.appendChild(actinideRow);
