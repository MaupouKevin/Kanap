// PARTIE QUI AFFICHE LES INFORMATIONS SUR LA PAGE product.html 
//--------------------------------------------------------------------------------
// Fonction qui intègre les différentes données du canapé dans la page product.html
const displayKanapInformations = () => {
    // Création des div recevants les images & informations
    document.querySelector(".item__img").innerHTML = `<img src="${kanapInformations.imageUrl}" alt="${kanapInformations.altTxt}">`;
    document.querySelector("#title").innerHTML = kanapInformations.name;
    document.querySelector("#price").innerHTML = kanapInformations.price;
    document.querySelector("#description").innerHTML = kanapInformations.description;
  
    // Une boucle "For in" qui parcourt les couleurs disponibles dans le tableau "kanapColors".
  for (let i in kanapColors) {
    document.querySelector("#colors").innerHTML += `
        <option value="${kanapColors[i]}">${kanapColors[i]}</option>
        `;
  }
  };
  
  // "url" prend comme valeur l'adresse internet de la page qui contient un id.
  let url = new URL(window.location.href);  
  
  // "id" utilise la propriété "searchParams" pour récupérer avec ".get" l'id de "url".
  let id = url.searchParams.get("id");

  let kanapInformations;
  let kanapColors = [];
  
  
  // Méthode Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON
  fetch("http://localhost:3000/api/products/" + id)
  
  .then((response) => {
    
    // SI la réponse est correct -> création du fichier.json
    if(response.ok) {
        response.json()
  
        // SI le fichier .json a été crée ALORS sa valeur est stocké dans la variable "kanapInformations" et les couleurs dans "kanapColors".
        .then((value) => {
            kanapInformations = value;
            kanapColors = kanapInformations.colors;
  
            displayKanapInformations();
        })
  
    } 
    
    else {
        console.log('Mauvaise réponse du réseau');
    }
  })
  
  // On récupère l'erreur dans l'une des requêtes.
  .catch((error) => {
    console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
  });
  