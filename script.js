const api_rumah_url = 'https://opendata.sumedangkab.go.id/index.php/api/6149382b82b12';

// async function getData() {
//   fetch(api_rumah_url)
//     .then(res => {
//       if (res.ok) {
//         console.log('success fetching');
//         return res.json()
//       } else {
//         console.log('failed fetching');
//       }
//     })
//     .catch(error => console.log('error'))
// }
async function fetchData() {
  try {
    const response = await fetch(api_rumah_url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('failed fetching data' + err);
  }
}

// let getData = async () => {
//   const a = await fetchData;
//   return a;
// };
// // dataRumah.then(data => {
//   console.log(data);
// })

// const fetchData = fetch(api_rumah_url)
//   .then((response) => response.json())
//   .then((data) => {
//     return data;
//   })

// const getData = async () => {
//   const d = await fetchData;
//   console.log(d);
// }

let dataRumah = fetchData()
dataRumah.then(data => console.log(data))
console.log(dataRumah);