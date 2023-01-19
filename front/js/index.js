//AFFICHAGE DES PRODUITS SUR LA PAGE INDEX

// Déclaration des fonctions
//--------------------------------------------------------------------------------------------------

// Fonction qui injecte le contenu de l'API présentant les canapés dans index.html.
const displayKanap = () => {
    for (let i = 0; i < listKanap.length; i++) {
      
      kanapBox.innerHTML += `
          <a href="./product.html?id=${listKanap[i]._id}">
              <article>
                  <img src="${listKanap[i].imageUrl}" alt="canapé : ${listKanap[i].altTxt}">
                  <h3 class="productName">${listKanap[i].name}</h3>
                  <p class="productDescription">${listKanap[i].description}</p>
              </article>
          </a>
          `;
    }
  };
  
  // Déclaration des variables
  //--------------------------------------------------------------------------------------------------
  
  // Variable "listKanap", un tableau vide qui va contenir le contenu des données de l'API.
  let listKanap = [];
  
  // Selection de la section "items" dans le DOM pour pouvoir lui injecter les données plus facilement.
  let kanapBox = document.getElementById("items");
  
  
  // Méthode Fetch qui récupère les données des canapés dans l'API et renvoie un fichier .json.
  fetch("http://localhost:3000/api/products")
  
    .then((response) => {
  
      //On vérifie que la promesse est résolue.
      if(response.ok) {
  
        // SI elle est est résolue alors on récupère le fichier .json qui contient les données.
        response.json()
    
        // Le fichier .json est traité et son contenu stocké dans la variable "listKanap".
        .then((value) => {
          listKanap = value;
  
          // Appel des fonctions d'affichage.
          displayKanap();
        })
  
      } else {
        console.log('Mauvaise réponse du réseau');
      }
    })
  
    // On récupère l'erreur dans l'une des requêtes.
    .catch((error) => {
      console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
    });