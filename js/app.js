
//console.log('ok');
const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
const PHOTOS_URL = 'https://cruth.phpnet.org/epfc/caviste/public/pics/';

fetch(API_URL + '/wines')
.then(response => response.json())
.then(data => {
    const ULWineList = document.querySelector('#wineList');
    ULWineList.innerHTML = '';

    data.forEach(wine => {
        console.log(wine.name);

        //ULWineList.innerHTML += `<li data-wine-id="${wine.id}" class="list-group-item" onclick="....">${wine.name}</li>`   //Solution 1
        let LI = document.createElement('li');              //Solution 2
        LI.innerHTML = wine.name;
        LI.classList.add('list-group-item');
        LI.dataset.wineId = wine.id;

        LI.addEventListener('click', function(e) {
            let wineId = LI.dataset.wineId;

            let results = data.filter(wine => wineId==wine.id);
            
            let wine = results.length>0 ? results[0] : undefined;

            console.log(wine);
            //Affichage de la photo du vin
            const photo = document.querySelector('#photo');
            photo.src = PHOTOS_URL + wine.picture;
        });

        ULWineList.appendChild(LI);
    });
})
