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

  // Récupération du bouton "ajouter au panier"
let cartButton = document.querySelector("#addToCart"); 
  
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
  
// PARTIE QUI TRAITE ET ENREGISTRE LES DONNÉES DANS LE localStorage
//--------------------------------------------------------------------------------

// Fonction qui sauvegarde les données du panier (LocalStorage).
const saveBasket = (cartContent) => {
  localStorage.setItem("basketItems", JSON.stringify(cartContent));
};

// Fonction qui récupère les données du panier(LocalStorage).
const getBasket = () => {
  let basket = localStorage.getItem("basketItems");

  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
};

let basket = getBasket();

// Fonction qui va ajouter des produits dans le panier (localStorage).
const addBasket = (product) => {
 
  // Vérifie si un canapé stocké dans le LocalStorage (variable basket) a déjà le même ID et la même couleur, si c'est pas le cas alors retourne : "undefined".
  let findProduct = basket.find((p) => p.id == product.id && p.color == product.color);

  // Si le produit existe déjà dans le localStorage avec le même id et la même couleur alors on incrémente la quatité.
  if (findProduct != undefined) {

    if (findProduct.quantity >= 100) {
      alert ('Vous avez déjà atteint la quantité maximale autorisée pour ce produit');

    } else if (findProduct.quantity < 100) {
        findProduct.quantity += product.quantity;

        if (findProduct.quantity > 100) {
          alert ('Vous avez dépassé la quantité maximale autorisée de ce produit dans votre panier, la nouvelle quantité est de 100');
          findProduct.quantity = 100;
          
        } else {
            alert ('La quantité du produit a été mise à jour avec succès !');
          }
      }
    
    // Sinon le resultat est "undefined" et donc le produit n'existe pas dans le panier donc on le rajoute au tableau "basket".
  } else {
    basket.push(product);
    alert ('Le produit a bien été ajouté dans votre panier !');
  }

  saveBasket(basket);
};

// Création d'un évènement au clic sur le bouton "ajouter au panier".
cartButton.addEventListener("click", () => {

  let color = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  if (color != "" && quantity <= 0 || quantity > 100) {

    alert("Quantité invalide, selectionnez une quantité comprise entre 1 - 100");
  }

  else if (color == "" && quantity > 0 && quantity <= 100) {
    
    alert("Vous n'avez pas sélectionné la couleur de votre produit");
  }

  // Si "color" n'est pas vide ET que "quantity" est supérieur à 0, on exécute la fonction "addBasket".
  else if (color != "" && quantity > 0 && quantity <= 100) {
  
    addBasket({
      id: id,
      color: color,
      quantity: Number(quantity),
    });

  } else {
    
    alert("Veuillez sélectionner une couleur et une quantité (1 - 100)");
  }
});