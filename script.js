const api_usaha_url = 'https://opendata.sumedangkab.go.id/index.php/api/614a94fe6f021';
const api_jalan_url = 'https://opendata.sumedangkab.go.id/index.php/api/6147dd371656e';
const api_penduduk_url = 'https://opendata.sumedangkab.go.id/index.php/api/61493671239d6';
const api_kriminal_url = 'https://opendata.sumedangkab.go.id/index.php/api/61f10d9a00b06';
const api_wisatawan_url = 'https://opendata.sumedangkab.go.id/index.php/api/61d6493fdaea0';


async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('failed fetching data' + err);
  }
}


async function topsis() {
  const dataJalan = await fetchData(api_jalan_url);
  const dataUsaha = await fetchData(api_usaha_url);
  const dataPenduduk = await fetchData(api_penduduk_url);
  const dataKriminal = await fetchData(api_kriminal_url);
  const dataWisatawan = await fetchData(api_wisatawan_url);
  // const bobotJalan = 0.3;
  console.log(dataWisatawan);
  let dataset = [];

  for (let i = 1; i < dataJalan.length; i++) {
    let obj = {}
    obj.kecamatan = dataJalan[i][2];
    obj.kondisiJln = dataJalan[i][3];
    obj.jmlUsahaMikro = dataUsaha[i][3];
    obj.jmlUsahaKecil = dataUsaha[i][4];
    obj.jmlUsahaMenengah = dataUsaha[i][5];
    obj.jmlPenduduk = dataPenduduk[i][4];
    obj.risikoKejahatan = dataKriminal[i][3];
    obj.jmlWisatawan = dataWisatawan[i][4];
    dataset.push(obj)
  }

  // for(let i = 0 ; i < dataset.length; i++){
  //   console.log(dataset[i])
  // }
  console.log(dataset)
}

topsis()

