//console.log('ok');
const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
const PHOTOS_URL = 'https://cruth.phpnet.org/epfc/caviste/public/pics/';

let selectedWine = undefined;   //Vin sélectionné

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
            
            selectedWine = results.length>0 ? results[0] : undefined;

            console.log(selectedWine);
            //Affichage de la photo du vin
            const photo = document.querySelector('#photo');
            photo.src = PHOTOS_URL + wine.picture;
            photo.alt = wine.name;

            //Afficher les détails
            let badge = document.querySelector("#details h2 span.badge");
            badge.innerHTML = wineId;

            let h2 = document.querySelector("#details h2");
            let wineName = document.createTextNode(' '+wine.name);
            h2.innerHTML = '';
            h2.appendChild(badge);
            h2.appendChild(wineName);

            let spanGrapes = document.querySelector("#grapes span");
            spanGrapes.innerHTML = wine.grapes;

            let spanCountry = document.querySelector("#country span");
            spanCountry.innerHTML = wine.country;

            //...

            let divInfos = document.querySelector("#infos");
            divInfos.innerHTML = wine.description;
        });

        ULWineList.appendChild(LI);
    });

    //Sélectionner le lien des commentaires
    let linkCommentaires = document.querySelector("#linkCommentaires");

    //Ajouter un gestionnaire d'évènement clic
    linkCommentaires.addEventListener('click', function(e) {    //console.log('ok');
        //Récupérer tous les commentaires du vin sélectionné
        console.log(selectedWine);
        
            //Envoyer une requête Ajax à l'API Caviste
        fetch(API_URL + '/wines/'+selectedWine.id+'/comments')   //TODO mettre le bon id de vin
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });

        //Afficher ces commentaires dans le div "infos"
        let divInfos = document.querySelector("#infos");
        
    });

    

})