const https = require('https');

const yargs = require('yargs');

var argv = yargs.option('currency', {
    alias: 'c',
    describe: `Choose the currency type
               'O' for Dollar Oficial
               'B' for Dollar Blue
               'E' for Euro
               'R' for Real
               'P' for Peso`,
    choices: ['O', 'B', 'E', 'R', 'P'],
    default: 'P'
})
    .option('value', {
        alias: 'v',
        describe: 'value to convert',
        default: 100
    })
    .option('format', {
        alias: 'f',
        describe: `Response format
                   T for Table
                   J for Json
                   C for Exchange Rate`,
        choises: ['T', 'J', 'C'],
        default: 'J'
    })
    .argv;

const currencyType = argv.currency;
const inputValue = argv.value;
const printFormat = argv.format;

const DOLAR_URL = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const REAL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ah';
const EURO_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ta';

let officialDolar = 0;
let blueDolar = 0;
let euro = 0;
let real = 0;
let peso = 0;

const getDolar = new Promise((resolve, reject) => {
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

const getEuro = new Promise((resolve, reject) => {
    https.get(EURO_URL, (res) => {
        res.on('data', (data) => {
            let resp = JSON.parse(data);
            resolve(parseFloat(resp[0].dolar.venta.replace(',', '.')));
        });

    }).on('error', (err) => {
        reject(err);
    });
});

const getReal = new Promise((resolve, reject) => {
    https.get(REAL_URL, (res) => {
        res.on('data', (data) => {
            let resp = JSON.parse(data);
            resolve(parseFloat(resp[0].dolar.venta.replace(',', '.')));
        });

    }).on('error', (err) => {
        reject(err);
    });
});

let getPeso = (currency, value) => {
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

let printTable = () => {
    console.log('Currency Converter');
    console.log('-----------------------');
    console.log('Peso Argentino: ', peso.toFixed(3));
    console.log(`Dolar Oficial (${officialDolar}): ${(peso / officialDolar).toFixed(3)}`);
    console.log(`Dolar Blue (${blueDolar}):  ${(peso / blueDolar).toFixed(3)}`);
    console.log(`Real (${real}):  ${(peso / real).toFixed(3)}`);
    console.log(`Euro (${euro}):  ${(peso / euro).toFixed(3)}`);
}

let printJson = () => {
    var currencies = {
        currencies: [
            { name: 'ARS', value: peso.toFixed(3) },
            { name: 'USD', value: (peso / officialDolar).toFixed(3) },
            { name: 'USD-B', value: (peso / blueDolar).toFixed(3) },
            { name: 'EUR', value: (peso / euro).toFixed(3) },
            { name: 'BRL', value: (peso / real).toFixed(3) },
        ]
    };
    console.log(currencies);
}

let printExchangeRate = () => {
    var currencies = {
        currencies: [
            { name: 'USD', value: officialDolar.toFixed(3) },
            { name: 'USD-B', value: blueDolar.toFixed(3) },
            { name: 'EUR', value: euro.toFixed(3) },
            { name: 'BRL', value: real.toFixed(3) },
        ]
    };
    console.log(currencies);
}

const currencies = [getDolar, getEuro, getReal];

Promise
    .all(currencies)
    .then(data => {
        [{ officialDolar, blueDolar }, euro, real] = data;
        if (printFormat != 'C') {
            peso = getPeso(currencyType, inputValue);

            if (printFormat === 'T') {
                printTable();
            } else {
                printJson();
            }
        } else {
            printExchangeRate();
        }
    })
    .catch(err => console.log(err));
