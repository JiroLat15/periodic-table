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
            td.classList.add("element-cell");
            td.dataset.group = cell.category || "unknown";

            td.innerHTML = `
                <div class="element-content">
                    <div class="left-info">
                        <div class="atomic-number">${cell.number}</div>
                        <div class="symbol">${cell.symbol}</div>
                        <div class="element-name">${cell.name}</div>
                    </div>
                    <div class="energy-levels">
                        ${(cell.energyLevels || []).map(level => `<div>${level}</div>`).join("")}
                    </div>
                </div>
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

// === ALIAS MAP FOR BROAD CATEGORIES ===
const categoryAliases = {
  metals: [
    "alkali-metal",
    "alkaline-earth-metal",
    "transition-metal",
    "post-transition-metal",
    "lanthanide",
    "actinide"
  ],
  nonmetals: [
    "reactive-nonmetal",
    "noble-gas"
  ]
};

// === DOM SELECTORS ===
const filterButtons = document.querySelectorAll('.filter-btn');
const allCells = document.querySelectorAll('.element-cell');

// === MAIN EVENT LISTENER ===
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.dataset.category;
    const isActive = button.classList.contains("active");

    // === TOGGLE THE BUTTON ITSELF ===
    button.classList.toggle("active");

    // === HANDLE MAIN CATEGORIES ===
    if (category === "metals" || category === "nonmetals") {
      const thisSubs = categoryAliases[category];
      const otherMain = category === "metals" ? "nonmetals" : "metals";
      const otherSubs = categoryAliases[otherMain];

      if (!isActive) {
        // Activate all subcategory buttons of this group
        filterButtons.forEach(btn => {
          if (thisSubs.includes(btn.dataset.category)) {
            btn.classList.add("active");
          }
        });

        // Deactivate other main + their subcategories
        filterButtons.forEach(btn => {
          if (
            btn.dataset.category === otherMain ||
            otherSubs.includes(btn.dataset.category)
          ) {
            btn.classList.remove("active");
          }
        });

        // Turn off metalloids
        filterButtons.forEach(btn => {
          if (btn.dataset.category === "metalloid") {
            btn.classList.remove("active");
          }
        });
      } else {
        // If we're untoggling the main button, untoggle all its subs
        filterButtons.forEach(btn => {
          if (thisSubs.includes(btn.dataset.category)) {
            btn.classList.remove("active");
          }
        });
      }
    }

    // === HANDLE METALLOIDS ===
    else if (category === "metalloid") {
      if (!isActive) {
        // Untoggle main buttons (but not their subcategories)
        filterButtons.forEach(btn => {
          if (btn.dataset.category === "metals" || btn.dataset.category === "nonmetals") {
            btn.classList.remove("active");
          }
        });
      }
    }

    // === HANDLE SUBCATEGORIES ===
    else {
      if (!isActive) {
        // Untoggle parent main category if it's active
        for (const [mainCat, subList] of Object.entries(categoryAliases)) {
          if (subList.includes(category)) {
            filterButtons.forEach(btn => {
              if (btn.dataset.category === mainCat) {
                btn.classList.remove("active");
              }
            });
          }
        }
      }
    }

    // === GATHER ALL ACTIVE CATEGORIES ===
    const activeCategories = Array.from(filterButtons)
      .filter(btn => btn.classList.contains("active"))
      .map(btn => {
        const cat = btn.dataset.category;
        return categoryAliases[cat] || [cat]; // map metals -> [...], etc.
      })
      .flat();

    // === APPLY DIMMING BASED ON ACTIVE FILTERS ===
    allCells.forEach(cell => {
      const group = cell.dataset.group;
      if (activeCategories.length === 0) {
        // Nothing selected — show all
        cell.classList.remove("dimmed");
      } else if (activeCategories.includes(group)) {
        // Match found — highlight
        cell.classList.remove("dimmed");
      } else {
        // Not in active set — dim
        cell.classList.add("dimmed");
      }
    });
  });
});

