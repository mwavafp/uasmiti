// index.js
function generateInputs() {
  const criteriaCount = parseInt(
    document.getElementById("criteriaCount").value
  );
  const productCount = parseInt(document.getElementById("productCount").value);

  if (
    isNaN(criteriaCount) ||
    criteriaCount <= 0 ||
    isNaN(productCount) ||
    productCount <= 0
  ) {
    alert("Masukkan jumlah kriteria dan produk yang valid!");
    return;
  }

  let inputsHTML = "<h3>Masukkan Nama Kriteria:</h3>";

  for (let i = 1; i <= criteriaCount; i++) {
    inputsHTML += `<label for='criteria${i}'>Kriteria ${i}: </label>
                       <input type='text' id='criteria${i}' required /><br><br>`;
  }

  inputsHTML += "<h3>Masukkan Nama Produk:</h3>";

  for (let i = 1; i <= productCount; i++) {
    inputsHTML += `<label for='product${i}'>Produk ${i}: </label>
                       <input type='text' id='product${i}' required /><br><br>`;
  }

  inputsHTML += `<button onclick='generateTable()'>Generate Table</button>`;

  document.getElementById("dynamicInputs").innerHTML = inputsHTML;
}

function generateTable() {
  const criteriaCount = parseInt(
    document.getElementById("criteriaCount").value
  );
  const productCount = parseInt(document.getElementById("productCount").value);

  const criteriaNames = [];
  for (let i = 1; i <= criteriaCount; i++) {
    const criteriaName = document.getElementById(`criteria${i}`).value.trim();
    if (!criteriaName) {
      alert(`Nama kriteria ${i} tidak boleh kosong!`);
      return;
    }
    criteriaNames.push(criteriaName);
  }

  const productNames = [];
  for (let i = 1; i <= productCount; i++) {
    const productName = document.getElementById(`product${i}`).value.trim();
    if (!productName) {
      alert(`Nama produk ${i} tidak boleh kosong!`);
      return;
    }
    productNames.push(productName);
  }

  let tableHTML = "<table id='mainTable'>";

  // Header baris pertama untuk produk
  tableHTML += "<thead><tr><th>Kriteria</th>";
  productNames.forEach((product) => {
    tableHTML += `<th>${product}</th>`;
  });
  tableHTML += "</tr></thead><tbody>";

  // Baris untuk masing-masing kriteria
  criteriaNames.forEach((criteria, index) => {
    tableHTML += `<tr><td>${criteria}</td>`;
    productNames.forEach((_, productIndex) => {
      tableHTML += `<td><input type='number' class='criteria-input' data-criteria='${index}' data-product='${productIndex}' /></td>`;
    });
    tableHTML += "</tr>";
  });

  // Baris terakhir untuk rata-rata per produk
  tableHTML += "<tr><td><b>Total Rata-rata</b></td>";
  productNames.forEach((_, productIndex) => {
    tableHTML += `<td id='average-product-${productIndex}'></td>`;
  });
  tableHTML += "</tr>";

  tableHTML += "</tbody></table>";
  tableHTML += `<button onclick='calculateAverages(${criteriaCount}, ${productNames.length})'>Hitung Rata-Rata</button>`;
  tableHTML += `<button onclick='generateWeightedTable(${criteriaCount}, ${productNames.length})'>Pemberian Bobot Point</button>`;

  document.getElementById("generatedTable").innerHTML = tableHTML;
  document.getElementById("dynamicInputs").innerHTML = ""; // Clear input form
}

function calculateAverages(criteriaCount, productCount) {
  for (let p = 0; p < productCount; p++) {
    let total = 0;
    let count = 0;

    for (let c = 0; c < criteriaCount; c++) {
      const input = document.querySelector(
        `[data-criteria='${c}'][data-product='${p}']`
      );
      const value = parseFloat(input.value);

      if (!isNaN(value)) {
        total += value;
        count++;
      }
    }

    const average = count > 0 ? (total / count).toFixed(2) : "-";
    document.getElementById(`average-product-${p}`).innerText = average;
  }
}

function generateWeightedTable(criteriaCount, productCount) {
  const criteriaNames = [];
  for (let c = 0; c < criteriaCount; c++) {
    const criteriaName = document.querySelector(
      `table thead tr th:nth-child(${c + 2})`
    ).innerText;
    criteriaNames.push(criteriaName);
  }

  const productNames = [];
  for (let p = 0; p < productCount; p++) {
    const productName = document.querySelector(
      `table thead tr th:nth-child(${p + 2})`
    ).innerText;
    productNames.push(productName);
  }

  let weightedHTML = "<table>";

  // Header baris pertama untuk produk
  weightedHTML += "<thead><tr><th>Kriteria</th>";
  productNames.forEach((product) => {
    weightedHTML += `<th>${product}</th>`;
  });
  weightedHTML += "</tr></thead><tbody>";

  // Baris untuk masing-masing kriteria dengan bobot
  for (let c = 0; c < criteriaCount; c++) {
    const values = [];

    for (let p = 0; p < productCount; p++) {
      const input = document.querySelector(
        `[data-criteria='${c}'][data-product='${p}']`
      );
      const value = parseFloat(input.value);

      if (!isNaN(value)) {
        values.push({ productIndex: p, value });
      }
    }

    values.sort((a, b) => b.value - a.value);

    let score = 9;
    const scores = new Array(productCount).fill(0);

    values.forEach((entry, index) => {
      scores[entry.productIndex] = score;
      score = Math.max(1, score - 1);
    });

    weightedHTML += `<tr><td>${criteriaNames[c]}</td>`;
    scores.forEach((score) => {
      weightedHTML += `<td>${score}</td>`;
    });
    weightedHTML += "</tr>";
  }

  // Baris terakhir untuk rata-rata per produk setelah pembobotan
  weightedHTML += "<tr><td><b>Total Rata-rata</b></td>";
  for (let p = 0; p < productCount; p++) {
    let total = 0;
    let count = 0;

    for (let c = 0; c < criteriaCount; c++) {
      const input = document.querySelector(
        `[data-criteria='${c}'][data-product='${p}']`
      );
      const value = parseFloat(input.value);

      if (!isNaN(value)) {
        total += value;
        count++;
      }
    }

    const average = count > 0 ? (total / count).toFixed(2) : "-";
    weightedHTML += `<td>${average}</td>`;
  }
  weightedHTML += "</tr>";

  weightedHTML += "</tbody></table>";
  document.getElementById("weightedTable").innerHTML = weightedHTML;
}
