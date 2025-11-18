
const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';
const PHOTOS_URL = 'https://cruth.phpnet.org/epfc/caviste/public/pics/';
let idVin = "";
let gData;  //DEBUG in console

function MainList(data, ULWineList) {
    ULWineList.innerHTML = "";

    data.forEach(wine => {
        let LI = document.createElement('li');
        LI.innerHTML = wine.name;
        LI.classList.add('list-group-item');
        LI.dataset.wineId = wine.id;

        LI.addEventListener('click', function () {
            idVin = wine.id;
            affichage(wine);

            activateThumbnail(document.querySelector('#linkDescriptions'));
        });

        ULWineList.appendChild(LI);
    });
}

//A la fin du chargement de la page
window.addEventListener('load', () => {
    //Désactiver tous les liens
    document.querySelectorAll('a:not(.menu-link)').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });
});

// CHARGEMENT INITIAL DES VINS

fetch(API_URL + '/wines')
    .then(response => response.json())
    .then(data => {     gData = data;   //DEBUG in console
        const ULWineList = document.querySelector('#wineList');
        ULWineList.innerHTML = '';

        // LISTE DES VINS
        MainList(data, ULWineList);

        //permet d'appliquer le filtre sur le pays et l'année
        let btfiltre = document.querySelector('#btFilter');
        btfiltre.addEventListener('click', function (e) {
            let countryVal = document.getElementById("country").value.trim();
            let yearVal = document.getElementById("year").value.trim();

            let filterCountry = countryVal != "";
            let filterYear = yearVal != "";
            
            //Filtrer la liste par année et/ou par pays
            let filteredData = filterYear ? data.filter(wine => wine.year==yearVal) : data;
            filteredData = filterCountry ? filteredData.filter(wine => wine.country==countryVal) : filteredData;

            //Actualiser la liste des vins dans la page
            MainList(filteredData, ULWineList);
        });

        //permet de rechercher un vin dans la liste
        let btsearch = document.querySelector("#btSearch");
        btsearch.addEventListener('click', function () {
            let searchval = document.querySelector("#keyword").value.trim().toLowerCase();

            //Filtrer la liste par année et/ou par pays
            let filteredData = searchval !== "" ? data.filter(wine => wine.name.toLowerCase().includes(searchval)) : data;

            MainList(filteredData, ULWineList);
        });

        //Gestion de la touche ENTER
        let editKeyword = document.querySelector("#keyword");
        editKeyword.addEventListener('keypress', (e) => {   //console.log(e);
            if(e.keyCode==13) {
                e.preventDefault();

                btsearch.click();
            }
        });



    });

// FONCTION PRINCIPALE D’AFFICHAGE DES DETAILS DU VIN

function affichage(wine) {

    // Photo
    const photo = document.querySelector('#photo');
    photo.src = PHOTOS_URL + wine.picture;

    // ID + Nom
    let badge = document.querySelector("#details h2 span.badge");
    badge.innerHTML = wine.id;

    let h2 = document.querySelector("#details h2");
    h2.innerHTML = "";
    h2.appendChild(badge);
    h2.appendChild(document.createTextNode(" " + wine.name));

    // Grape
    let grape = document.querySelector("#details #grape");
    grape.innerHTML = wine.grapes;

    // Country
    let country = document.querySelector("#details #country");
    country.innerHTML = wine.country;

    // Region
    let region = document.querySelector("#details #region");
    region.innerHTML = wine.region;

    // Year
    let year = document.querySelector("#details #year");
    year.innerHTML = wine.year;

    // Capacity
    let capacity = document.querySelector("#details #capacity");
    capacity.innerHTML = wine.capacity;

    // Color
    let color = document.querySelector("#details #color");
    color.innerHTML = wine.color;

    // Price
    let price = document.querySelector("#details #price");
    price.innerHTML = wine.price;
    Chargerdescription(wine.id);
}



// CHARGER LA DESCRIPTION

function Chargerdescription(wineID) {
    fetch(API_URL + '/wines/' + wineID)
        .then(res => res.json())
        .then(data => {
            const infos = document.querySelector("#infos");
            infos.innerHTML = data[0].description;
        });
}

// CHARGER LES COMMENTAIRES

function chargerComments(wineID) {
    fetch(API_URL + '/wines/' + wineID + '/comments')
        .then(response => response.json())
        .then(data => {

            //map() parcourt un tableau et retourne un nouveau tableau 
            // contenant le résultat. ici il retourne un tableau contenant
            //seulement les commentaires
            let CommentContent = data.map(comments => comments.content).join(", ");
            document.querySelector("#infos").innerHTML = CommentContent;
        });
}

function chargerNotes(wineID) {
    const options = {
        'method': 'GET',
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa('ced:123')	//Try with other credentials (login:password)
        }
    };

    fetch(API_URL + '/wines/' + wineID + '/notes', options)
    .then(response => response.json())
    .then(data => {     console.log(data);
        document.querySelector("#infos").innerHTML = data.note ? data.note : '';
    });
}

function activateThumbnail(selectedLink) {
    //Désactiver la classe active de tous les onglets
    selectedLink.parentElement.parentElement.querySelectorAll('a.nav-link')
        
    const links = document.querySelector('#linkDescriptions').parentElement.parentElement.querySelectorAll('a.nav-link')
    links.forEach(link => {link.classList.remove('active')})

    //Activer l'onglet 'Commentaires'
    selectedLink.classList.add('active');
}

//permet de charger la description quand on clic dessus
document.querySelector("#linkDescriptions").addEventListener('click', (e) => {
    if (idVin) Chargerdescription(idVin);

    activateThumbnail(e.target);
});

//permet de charger les commentaire  quand on clic dessus
document.querySelector("#linkCommentaires").addEventListener('click', (e) => {
    if (idVin) chargerComments(idVin);
    
    activateThumbnail(e.target);
});

//permet de charger les notes  quand on clic dessus
document.querySelector("#linkNotes").addEventListener('click', (e) => {
    if (idVin) chargerNotes(idVin);
    
    activateThumbnail(e.target);
});

function Selectedcountry() {
    let countryFiltre = document.querySelector("#country").value.trim().toLowerCase();
    return countryFiltre;
}

function SelectedYear() {
    let yearFiltre = document.querySelector("#year").value.trim().toLowerCase();
    return yearFiltre;
}

/*if(idVin) {
    FiltreBycountry(idVin);
} */