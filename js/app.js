//console.log("Bonjour");
const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';

fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines')
    .then(response => response.json())
    .then(json => {
        json.forEach(wine => {
            console.log(wine.name);
        });

    });
