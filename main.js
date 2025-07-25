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

// === CATEGORY ALIASES ===
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

// === ACTIVE STATE TRACKING ===
const activeCategories = new Set();
const activeMainCategories = new Set();

// === ELEMENT VISIBILITY HANDLING ===
function updateElementVisibility() {
  const cells = document.querySelectorAll(".element-cell");

  if (activeCategories.size === 0) {
    cells.forEach(cell => cell.classList.remove("dimmed"));
    return;
  }

  cells.forEach(cell => {
    const group = cell.dataset.group;
    if (activeCategories.has(group)) {
      cell.classList.remove("dimmed");
    } else {
      cell.classList.add("dimmed");
    }
  });
}

// === BUTTON CLICK HANDLERS ===

// Subcategory button click
function subcategoryClick(category) {
  const button = document.querySelector(`[data-category="${category}"]`);
  const isActive = activeCategories.has(category);

  if (isActive) {
    activeCategories.delete(category);
    button.classList.remove("active");
  } else {
    activeCategories.add(category);
    button.classList.add("active");
  }

  for (const [main, subs] of Object.entries(categoryAliases)) {
    const allActive = subs.every(sub => activeCategories.has(sub));
    const mainButton = document.querySelector(`[data-category="${main}"]`);

    if (allActive) {
      activeMainCategories.add(main);
      mainButton.classList.add("active");
    } else {
      activeMainCategories.delete(main);
      mainButton.classList.remove("active");
    }
  }

  updateElementVisibility();
}

// Main category button click
function mainCategoryClick(main) {
  const button = document.querySelector(`[data-category="${main}"]`);
  const subcategories = categoryAliases[main];
  const isActive = activeMainCategories.has(main);

  if (isActive) {
    activeMainCategories.delete(main);
    button.classList.remove("active");

    subcategories.forEach(sub => {
      activeCategories.delete(sub);
      document.querySelector(`[data-category="${sub}"]`).classList.remove("active");
    });
  } else {
    activeMainCategories.add(main);
    button.classList.add("active");

    subcategories.forEach(sub => {
      activeCategories.add(sub);
      document.querySelector(`[data-category="${sub}"]`).classList.add("active");
    });
  }

  updateElementVisibility();
}


// Metalloids button click (independent)
function toggleMetalloids() {
  const btn = document.querySelector(`[data-category="metalloid"]`);
  const isActive = activeCategories.has("metalloid");

  if (isActive) {
    activeCategories.delete("metalloid");
    btn.classList.remove("active");
  } else {
    activeCategories.add("metalloid");
    btn.classList.add("active");
  }

  updateElementVisibility();
}

// === EVENT LISTENER BINDING ===
document.querySelectorAll("[data-category]").forEach(button => {
  const category = button.dataset.category;

  if (category === "metalloid") {
    button.addEventListener("click", () => toggleMetalloids());
  } else if (categoryAliases[category]) {
    button.addEventListener("click", () => mainCategoryClick(category));
  } else {
    button.addEventListener("click", () => subcategoryClick(category));
  }
});
