# currency-converter

## Install
`npm i currencies-converter`

## Usage
Include the module in your .js file
![help](https://github.com/LeoPuertas/currency-converter/issues/1#issue-607789701)

### Examples

# Get currency equiv in ARS 
`$ node index.js`
```bash
{
  currencies: [
    { name: 'USD', value: '68.860' },
    { name: 'USD-B', value: '118.000' },
    { name: 'EUR', value: '74.910' },
    { name: 'BRL', value: '14.260' }
  ]
}
```

# Convert from Oficial Dollar 
`$ node index.js -c O -v 100 -f J`
```bash
{
  currencies: [
    { name: 'ARS', value: '6886.000' },
    { name: 'USD', value: '100.000' },
    { name: 'USD-B', value: '58.356' },
    { name: 'EUR', value: '91.924' },
    { name: 'BRL', value: '482.889' }
  ]
}
```

# Convert from Euro
`$ node index.js -c E -v 100 -f J`
```bash
{
  currencies: [
    { name: 'ARS', value: '6886.000' },
    { name: 'USD', value: '100.000' },
    { name: 'USD-B', value: '58.356' },
    { name: 'EUR', value: '91.924' },
    { name: 'BRL', value: '482.889' }
  ]
}
```
# Convert from Pesos in table format
`$ node index.js -c P -v 10000 -f T`
```bash

    Currency Converter
    -----------------------
    Peso Argentino:  10000.000
    Dolar Oficial (68.86): 145.222
    Dolar Blue (118):  84.746
    Real (14.26):  701.262
    Euro (74.91):  133.494
```


