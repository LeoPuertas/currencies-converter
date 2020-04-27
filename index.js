const https = require('https');

const argv = require('yargs').argv

if (!argv.currencyType && !argv.value) {
    console.log('O for Dollar Oficial');
    console.log('B for Dollar Blue');
    console.log('E for Euro');
    console.log('R for Real');
    console.log('P for Peso');
    throw new Error('CurrencyType and value are required')
}

const currencyType = argv.currencyType;
const inputValue = argv.value;

const DOLAR_URL = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const REAL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ah';
const EURO_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ta';

let officialDolar = 0;
let blueDolar = 0;
let euro = 0;
let real = 0;
let peso = 0;

const dolarValue = new Promise((resolve, reject) => {
    https.get(DOLAR_URL, (res) => {
        res.on('data', (data) => {
            let resp = JSON.parse(data);
            let official = resp.find(element => element.casa.nombre === 'Dolar Oficial');
            let blue = resp.find(element => element.casa.nombre === 'Dolar Blue');
            if (official && blue) {
                resolve(
                    {
                        officialDolar: parseFloat(official.casa.venta.replace(',', '.')),
                        blueDolar: parseFloat(blue.casa.venta.replace(',', '.')),
                    }
                );
            }
        });

    }).on('error', (err) => {
        reject(err);
    });
});

const euroValue = new Promise((resolve, reject) => {
    https.get(EURO_URL, (res) => {
        res.on('data', (data) => {
            let resp = JSON.parse(data);
            resolve(parseFloat(resp[0].dolar.venta.replace(',', '.')));
        });

    }).on('error', (err) => {
        reject(err);
    });
});

const realValue = new Promise((resolve, reject) => {
    https.get(REAL_URL, (res) => {
        res.on('data', (data) => {
            let resp = JSON.parse(data);
            resolve(parseFloat(resp[0].dolar.venta.replace(',', '.')));
        });

    }).on('error', (err) => {
        reject(err);
    });
});

let pesoValue = (currency, value) => {
    switch (currency) {
        case 'O':
            return officialDolar * value;
        case 'B':
            return blueDolar * value;
        case 'E':
            return euro * value;
        case 'R':
            return real * value;
        case 'P':
            return value;
    }
}

const currencies = [dolarValue, euroValue, realValue];

Promise
    .all(currencies)
    .then(data => {
        [{ officialDolar, blueDolar }, euro, real] = data;
        peso = pesoValue(currencyType, inputValue);

        console.log('Currency Converter');
        console.log('-----------------------');
        console.log('Peso Argentino: ', peso.toFixed(3));
        console.log(`Dolar Oficial (${officialDolar}): ${(peso / officialDolar).toFixed(3)}` );
        console.log(`Dolar Blue (${blueDolar}):  ${(peso / blueDolar).toFixed(3)}`);
        console.log(`Real (${real}):  ${(peso / real).toFixed(3)}`);
        console.log(`Euro (${euro}):  ${(peso / euro).toFixed(3)}`);

    })
    .catch(err => console.log(err));
