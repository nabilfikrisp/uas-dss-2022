// ===============================
//          API DATASET
// ===============================
const api_usaha_url = "https://opendata.sumedangkab.go.id/index.php/api/614a94fe6f021";
const api_jalan_url = "https://opendata.sumedangkab.go.id/index.php/api/6147dd371656e";
const api_penduduk_url = "https://opendata.sumedangkab.go.id/index.php/api/61493671239d6";
const api_kriminal_url = "https://opendata.sumedangkab.go.id/index.php/api/61f10d9a00b06";
const api_wisatawan_url = "https://opendata.sumedangkab.go.id/index.php/api/61d6493fdaea0";

// ===============================
//          FETCH DATA
// ===============================
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("failed fetching data" + err);
  }
}

// ===============================
//       ALGORITMA TOPSIS
// ===============================
async function topsis() {
  const dataJalan = await fetchData(api_jalan_url);
  const dataUsaha = await fetchData(api_usaha_url);
  const dataPenduduk = await fetchData(api_penduduk_url);
  const dataKriminal = await fetchData(api_kriminal_url);
  const dataWisatawan = await fetchData(api_wisatawan_url);
  let selectedKecamatan = filter();

  // MENENTUKAN BOBOT
  const bobot = {
    jalan: 2,                                   // KRITERIA 'JALAN' MEMILIKI BOBOT 2
    penduduk: 5,                                // KRITERIA 'PENDUDUK' MEMILIKI BOBOT 5
    kriminal: 2,                                // KRITERIA 'KRIMINAL' MEMILIKI BOBOT 2
    wisatawan: 3,                               // KRITERIA 'WISATAWAN' MEMILIKI BOBOT 3
    usahaMikro: 4,                              // KRITERIA 'USAHA MIKRO' MEMILIKI BOBOT 4
  };

  // MENENTUKAN STATUS KRITERIA (BENEFIT/COST)
  const statusKriteria = {
    jalan: "benefit",                           // KRITERIA 'JALAN' TERMASUK BENEFIT
    penduduk: "benefit",                        // KRITERIA 'PENDUDUK' TERMASUK BENEFIT
    kriminal: "cost",                           // KRITERIA 'KRIMINAL' TERMASUK COST
    wisatawan: "benefit",                       // KRITERIA 'WISATAWAN' TERMASUK BENEFIT
    usahaMikro: "cost",                         // KRITERIA 'USAHA MIKRI' TERMASUK COST
  };

  // VARIABLE UNTUK MENAMPUNG DATA YANG DIPAKAI DARI OPEN DATA SUMEDANG API 
  let dataset = [];

  // VARIABLE PEMBAGI
  let pembagi = {
    jalan: 1,
    penduduk: 1,
    kriminal: 1,
    wisatawan: 1,
    usahaMikro: 1,
  };

  // SET NILAI VARIABEL 'DATASET'
  for (let i = 1; i < dataUsaha.length; i++) {
    let obj = {};
    obj.kecamatan = dataUsaha[i][2];            // MENGAMBIL KOLOM 'KECAMATAN' DARI OPENDATA SUMEDANG
    obj.jalan = dataJalan[i][3] * 1000;         // MENGAMBIL KOLOM 'JALAN' DARI OPENDATA SUMEDANG
    obj.usahaMikro = dataUsaha[i][3] * 1;       // MENGAMBIL KOLOM 'USAHA MIKRO' DARI OPENDATA SUMEDANG
    obj.penduduk = dataPenduduk[i][4] * 1;      // MENGAMBIL KOLOM 'PENDUDUK' DARI OPENDATA SUMEDANG
    obj.kriminal = dataKriminal[i][3] * 100;    // MENGAMBIL KOLOM 'KRIMINAL' DARI OPENDATA SUMEDANG
    obj.wisatawan = dataWisatawan[i][4] * 1;    // MENGAMBIL KOLOM 'WISATAWAN' DARI OPENDATA SUMEDANG
    dataset.push(obj);                          // MEMASUKKAN OBJECT KE DALAM ARRAY DATASET
  }

  // VARIABLE FILTERED DATASET (BERDASARKAN INPUT USER)
  let filteredDataset = [];
  
  // MEMASUKKAN DATA KE VARIABLE FILTERED DATASET BERDASARKAN PILIHAN KECAMATAN 
  for (let i = 0; i < dataset.length; i++) {
    if (selectedKecamatan.includes(dataset[i].kecamatan.toLowerCase())) {
      filteredDataset.push(dataset[i]);
    }
  }

  // SET VALUE DARI VARIABLE MATRIXNORMALIZE DENGAN FILTERED DATASET
  console.log('K',filteredDataset);
  let matrixNormalize = [...filteredDataset];

  // HITUNG PEMBAGI
  filteredDataset.forEach(function (datum) {
    pembagi.jalan += Math.pow(datum.jalan, 2);            // PEMBAGI UNTUK KRITERIA JALAN
    pembagi.penduduk += Math.pow(datum.penduduk, 2);      // PEMBAGI UNTUK KRITERIA PENDUDUK
    pembagi.kriminal += Math.pow(datum.kriminal, 2);      // PEMBAGI UNTUK KRITERIA KRIMINAL
    pembagi.wisatawan += Math.pow(datum.wisatawan, 2);    // PEMBAGI UNTUK KRITERIA WISATAWAN
    pembagi.usahaMikro += Math.pow(datum.usahaMikro, 2);  // PEMBAGI UNTUK KRITERIA USAHA MIKRO
  });
  Object.keys(pembagi).forEach(function (key) {
    pembagi[key] = Math.sqrt(pembagi[key]);
  });

  // HITUNG MATRIX TERNORMALISASI
  for (let i = 0; i < filteredDataset.length; i++) {
    matrixNormalize[i].jalan = filteredDataset[i].jalan / pembagi.jalan;                  // HITUNG NILAI MATRIX TERNORMALISASI KRITERIA JALAN BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixNormalize[i].usahaMikro = filteredDataset[i].usahaMikro / pembagi.usahaMikro;   // HITUNG NILAI MATRIX TERNORMALISASI KRITERIA USAHA MIKRO BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixNormalize[i].penduduk = filteredDataset[i].penduduk / pembagi.penduduk;         // HITUNG NILAI MATRIX TERNORMALISASI KRITERIA PENDUDUK BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixNormalize[i].kriminal = filteredDataset[i].kriminal / pembagi.kriminal;         // HITUNG NILAI MATRIX TERNORMALISASI KRITERIA KRIMINAL BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixNormalize[i].wisatawan = filteredDataset[i].wisatawan / pembagi.wisatawan;      // HITUNG NILAI MATRIX TERNORMALISASI KRITERIA WISATAWAN BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
  }

  // HITUNG MATRIX TERNORMALISASI TERBOBOT
  let matrixTerbobot = [...matrixNormalize];
  for (let i = 0; i < filteredDataset.length; i++) {
    matrixTerbobot[i].jalan = matrixNormalize[i].jalan * bobot.jalan;                     // HITUNG NILAI MATRIX TERBOBOT KRITERIA JALAN BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixTerbobot[i].usahaMikro = matrixNormalize[i].usahaMikro * bobot.usahaMikro;      // HITUNG NILAI MATRIX TERBOBOT KRITERIA USAHA MIKRO BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixTerbobot[i].penduduk = matrixNormalize[i].penduduk * bobot.penduduk;            // HITUNG NILAI MATRIX TERBOBOT KRITERIA PENDUDUK BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixTerbobot[i].kriminal = matrixNormalize[i].kriminal * bobot.kriminal;            // HITUNG NILAI MATRIX TERBOBOT KRITERIA KRIMINAL BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
    matrixTerbobot[i].wisatawan = matrixNormalize[i].wisatawan * bobot.wisatawan;         // HITUNG NILAI MATRIX TERBOBOT KRITERIA WISATAWAN BERDASARKAN KANDIDAT YANG DIPILIH USER (KECAMATAN)
  }

  // VARIABEL UNTUK A+ (IDEAL POSITIF)
  let aPlus = {
    jalan: 1,
    penduduk: 1,
    kriminal: 1,
    wisatawan: 1,
    usahaMikro: 1,
  };

  // VARIABEL UNTUK A- (IDEAL NEGATIF)
  let aMinus = {
    jalan: 1,
    penduduk: 1,
    kriminal: 1,
    wisatawan: 1,
    usahaMikro: 1,
  };


  aPlus.jalan = statusKriteria.jalan == "benefit" ? findMax(matrixTerbobot, "jalan") : findMin(matrixTerbobot, "jalan");                      // MENGHITUNG A+ UNTUK KRITERIA JALAN
  aPlus.penduduk = statusKriteria.penduduk == "benefit" ? findMax(matrixTerbobot, "penduduk") : findMin(matrixTerbobot, "penduduk");          // MENGHITUNG A+ UNTUK KRITERIA PENDUDUK
  aPlus.kriminal = statusKriteria.kriminal == "benefit" ? findMax(matrixTerbobot, "kriminal") : findMin(matrixTerbobot, "kriminal");          // MENGHITUNG A+ UNTUK KRITERIA KRIMINAL
  aPlus.wisatawan = statusKriteria.wisatawan == "benefit" ? findMax(matrixTerbobot, "wisatawan") : findMin(matrixTerbobot, "wisatawan");      // MENGHITUNG A+ UNTUK KRITERIA WISATAWAN
  aPlus.usahaMikro = statusKriteria.usahaMikro == "benefit" ? findMax(matrixTerbobot, "usahaMikro") : findMin(matrixTerbobot, "usahaMikro");  // MENGHITUNG A+ UNTUK KRITERIA USAHA MIKRO

  aMinus.jalan = statusKriteria.jalan == "cost" ? findMax(matrixTerbobot, "jalan") : findMin(matrixTerbobot, "jalan");                        // MENGHITUNG A- UNTUK KRITERIA JALAN
  aMinus.penduduk = statusKriteria.penduduk == "cost" ? findMax(matrixTerbobot, "penduduk") : findMin(matrixTerbobot, "penduduk");            // MENGHITUNG A- UNTUK KRITERIA PENDUDUK
  aMinus.kriminal = statusKriteria.kriminal == "cost" ? findMax(matrixTerbobot, "kriminal") : findMin(matrixTerbobot, "kriminal");            // MENGHITUNG A- UNTUK KRITERIA KRIMINAL
  aMinus.wisatawan = statusKriteria.wisatawan == "cost" ? findMax(matrixTerbobot, "wisatawan") : findMin(matrixTerbobot, "wisatawan");        // MENGHITUNG A- UNTUK KRITERIA WISATAWAN
  aMinus.usahaMikro = statusKriteria.usahaMikro == "cost" ? findMax(matrixTerbobot, "usahaMikro") : findMin(matrixTerbobot, "usahaMikro");    // MENGHITUNG A- UNTUK KRITERIA USAHA MIKRO

  // =========================
  //    DISTANCE D+ AND D-
  // =========================
  // VARIABEL ARRAY SEPMEASURE
  let sepMeasure = [];

  // MENGHITUNG D+ & D- PER KANDIDAT YANG DIPILIH USER (KECAMATAN)
  for (let i = 0; i < matrixTerbobot.length; i++) {
    let obj = {};
    obj.kecamatan = matrixTerbobot[i].kecamatan;
    
    // RUMUS UNTUK MENGHITUNG D+
    obj.dPlus =
      Math.pow(aPlus.jalan - matrixTerbobot[i].jalan, 2) +
      Math.pow(aPlus.penduduk - matrixTerbobot[i].penduduk, 2) +
      Math.pow(aPlus.kriminal - matrixTerbobot[i].kriminal, 2) +
      Math.pow(aPlus.wisatawan - matrixTerbobot[i].wisatawan, 2) +
      Math.pow(aPlus.usahaMikro - matrixTerbobot[i].usahaMikro, 2);
    
    // RUMUS UNTUK MENGHITUNG D-
    obj.dMinus =
      Math.pow(aMinus.jalan - matrixTerbobot[i].jalan, 2) +
      Math.pow(aMinus.penduduk - matrixTerbobot[i].penduduk, 2) +
      Math.pow(aMinus.kriminal - matrixTerbobot[i].kriminal, 2) +
      Math.pow(aMinus.wisatawan - matrixTerbobot[i].wisatawan, 2) +
      Math.pow(aMinus.usahaMikro - matrixTerbobot[i].usahaMikro, 2);

    obj.dPlus = Math.sqrt(obj.dPlus);
    obj.dMinus = Math.sqrt(obj.dMinus);
    sepMeasure.push(obj);
  }

  // =========================
  //        PREFERENCE
  // =========================
  // VARIABEL PREFERENSI
  let preference = [];

  // MENGHITUNG PREFERENSI UNTUK SETIAP KANDIDAT (KECAMATAN) 
  for (let i = 0; i < matrixTerbobot.length; i++) {
    let obj = {};
    obj.kecamatan = matrixTerbobot[i].kecamatan;
    obj.preference = sepMeasure[i].dMinus / (sepMeasure[i].dPlus + sepMeasure[i].dMinus);   // RUMUS UNTUK MENCARI NILAI PREFERENSI
    preference.push(obj);
  }

  // =========================
  //          RANK
  // =========================
  // MENGURUTKAN KANDIDAT / ALTERNATIF
  preference.sort((i, j) => {
    return j.preference - i.preference;
  });

  // ================================================
  //         CONSOLE LOG KECAMATAN TERFILTER
  // ================================================
  const rankList = document.querySelector("#hasil .list-group");

  // Reset Child setiap klik tombol
  while (rankList.firstChild) {
    rankList.removeChild(rankList.firstChild);
  }

  rankItems = "";
  for (let i = 0; i < preference.length; i++) {
    if (selectedKecamatan.includes(preference[i].kecamatan.toLowerCase())) {
      rankList
        .appendChild(
          Object.assign(document.createElement("li"), {
            innerHTML: preference[i].kecamatan,
            className: "list-group-item d-flex justify-content-between align-items-center",
          })
        )
        .appendChild(
          Object.assign(document.createElement("span"), {
            innerHTML: preference[i].preference,
            className: "badge bg-primary rounded-pill",
          })
        );
    }
  }
}

// =====================================
//         IDEAL POSITIF (A+)
// =====================================
function findMax(matrix, key) {
  let tempArray = [];
  for (let i = 0; i < matrix.length; i++) {
    tempArray.push(matrix[i][key]);
  }
  return Math.max(...tempArray);
}

// =====================================
//          IDEAL NEGATIF (A-)
// =====================================
function findMin(matrix, key) {
  let tempArray = [];
  for (let i = 0; i < matrix.length; i++) {
    tempArray.push(matrix[i][key]);
  }
  return Math.min(...tempArray);
}

// =====================================
//       FILTER INPUT KANDIDAT
// =====================================
function filter() {
  let inputKecamatan = document.querySelectorAll('input[name="kecamatan"]');
  let selectedKecamatan = [];
  inputKecamatan.forEach(function (datum) {
    if (datum.checked) {
      selectedKecamatan.push(datum.value);
    }
  });
  return selectedKecamatan;
}