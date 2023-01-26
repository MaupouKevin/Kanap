// PARTIE QUI AFFICHE LES INFORMATIONS SUR LA PAGE product.html 
//--------------------------------------------------------------------------------
let kanapInformations;
let kanapColors = [];

// Fonction qui intègre les différentes données du canapé dans la page product.html
const displayInformationsKanap = () => {
  document.querySelector(".item__img").innerHTML = `<img src="${kanapInformations.imageUrl}" alt="${kanapInformations.altTxt}">`;
  document.getElementById("title").innerHTML = kanapInformations.name;
  document.getElementById("price").innerHTML = kanapInformations.price;
  document.getElementById("description").innerHTML =
    kanapInformations.description;

 // Une boucle "For in" qui parcourt les couleurs disponibles dans le tableau "kanapColors".
  for (let i in kanapColors) {
    document.getElementById("colors").innerHTML += 
      `<option value="${kanapColors[i]}">${kanapColors[i]}</option>`;
  }
};

/* Une boucle "for each" qui parcourt les couleurs disponibles dans le tableau "kanapColors".

    kanapColors.forEach((kanapColor) => {
        colorsToAdd += `<option value="${kanapColor}">${kanapColor}</option>`;
    });

*/

// "url" prend comme valeur l'adresse internet de la page qui contient un id (?id=....).
const url = new URL(window.location.href);

// "id" utilise la propriété "searchParams" pour récupérer avec ".get" l'id de "url".
const id = url.searchParams.get("id");

// Récupération du bouton "ajouter au panier"
const cartButton = document.getElementById("addToCart");

// Méthode Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON
fetch("http://localhost:3000/api/products/" + id)

  .then((response) => {
  
    if(response.ok) {
      return response.json()
    }
    else {
      console.log('Mauvaise réponse du réseau');
    }
  })   
   /* Le fichier .json est traité,
  son contenu stocké dans la variable "kanapInformations" et les couleurs dans "kanapColors". */
  .then((value) => {
     kanapInformations = value;
    kanapColors = kanapInformations.colors;

    displayInformationsKanap();
  })

  // On récupère l'erreur dans l'une des requêtes.
  .catch((error) => {
    console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
  });

// PARTIE QUI TRAITE ET ENREGISTRE LES DONNÉES DANS LE window.localStorage
//--------------------------------------------------------------------------------

// Fonction qui sauvegarde les données du panier (LocalStorage).
const saveTheCart = (cartContent) => {
  window.localStorage.setItem("cartItems", JSON.stringify(cartContent));
};

// Fonction qui récupère les données du panier(LocalStorage).
const getFromCart = () => {
  let cart = window.localStorage.getItem("cartItems");

  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
};

let cart = getFromCart();

// Fonction qui va ajouter des produits dans le panier (window.localStorage).
const addToCart = (product) => {
 
  // Vérifie si un canapé stocké dans le LocalStorage (variable cart) a déjà le même ID et la même couleur, si c'est pas le cas alors retourne : "undefined".
  let findProduct = cart.find((p) => p.id == product.id && p.color == product.color);

  // Si le produit existe déjà dans le window.localStorage avec le même id et la même couleur alors on incrémente la quantité.
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
    
    // Sinon le resultat est "undefined" et donc le produit n'existe pas donc on le rajoute au tableau "cart".
  } else {
    cart.push(product);
    alert ('Le produit a bien été ajouté dans votre panier !');
  }

  saveTheCart(cart);
};

// Création d'un évènement au clic sur le bouton "ajouter au panier".
cartButton.addEventListener("click", () => {

  let color = document.getElementById("colors").value;
  let quantity = document.getElementById("quantity").value;

  if (color != "" && quantity <= 0 || quantity > 100) {

    alert("Quantité invalide, selectionnez une quantité comprise entre 1 - 100");
  }

  else if (color == "" && quantity > 0 && quantity <= 100) {
    
    alert("Vous n'avez pas sélectionné la couleur de votre produit");
  }

  // Si "color" n'est pas vide ET que "quantity" est supérieur à 0, on exécute la fonction "addcart".
  else if (color != "" && quantity > 0 && quantity <= 100) {
  
    addToCart({
      id: id,
      color: color,
      quantity: Number(quantity),
    });

  } else {
    
    alert("Veuillez sélectionner une couleur et une quantité (1 - 100)");
  }
});