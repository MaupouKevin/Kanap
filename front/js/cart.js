//DECLARATION DES FONCTIONS DE BASE POUR RECUPERER ET ECRIRE DANS LE LOCAL STORAGE
//---------------------------------------------------------------------------------

// Fonction qui récupère les données du LocalStorage.
const getFromCart = () => {
    let cart = localStorage.getItem("cartItems");

    if (cart == null) {
        return [];

    } else {
        return JSON.parse(cart);
    }
};

// Fonction qui sauvegarde les données du panier du LocalStorage.
const saveTheCart = (cartContent) => {
    localStorage.setItem("cartItems", JSON.stringify(cartContent));
};  

// DECLARATION DES FONCTIONS
//-----------------------------------------------------------------------------------

// Fonction qui calcule la quantité et le prix total des articles. 
const getTotalQty = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

        // boucle "for of" sur cartKanaps.
        for (let product of cartKanaps){
  
        // Pour la quantité : on ajoute la quantité de chaque produit à la valeur TotalQuantity existante.
        totalQuantity += product.quantity;

        // Pour le prix : On ajoute la quantité de chaque produit et on la multiplie par le prix.
        totalPrice += product.quantity * product.price;
    }

    // On affiche les éléments de quantité totale d'articles et le prix total dans le DOM.
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}

/* Fonction qui utilise la méthode (.find) pour parcourir nos 2 tableaux le localStorage et "cartKanaps" et rechercher une correspondance avec le produit "product" dont on souhaite modifier la quantité.
Si le produit est trouvé alors on change la quantité dans les tableaux, sinon on ne fait rien */
const quantityProduct = (product) => {
    const cart = getFromCart();
    let findProduct = cart.find((p) => p.id == product.id && p.color == product.color);

    if (findProduct != undefined) {
        findProduct.quantity = product.quantity;
    }

    let findkanap = cartKanaps.find((p) => p.id == product.id && p.color == product.color);

    if (findkanap != undefined) {
        findkanap.quantity = product.quantity;
    }
    
    saveTheCart(cart);
}

// Fonction qui va créer un eventListener avec la boucle "forEach" pour écouter les changements sur chaque input "itemQuantity".
const changeQuantityProduct = () => {
    const inputItemQuantity = document.getElementsByClassName('itemQuantity');
    // convertir inputQuantityToLoop en tableau
    const inputQuantityToLoop = Array.from(inputItemQuantity)

    inputQuantityToLoop.forEach(itemQuantity => {

        itemQuantity.addEventListener('change', (e) => {
            e.preventDefault();

            // Pour savoir sur quel produit on doit changer la quantité on récupère les données "id" et "color" de l'élément parent via (Element.closest).
            let retrieveParentData = itemQuantity.closest('.cart__item');

            if (Number(e.target.value) <= 0) {
                alert ('Pour supprimer un produit, veuillez cliquer sur le bouton "Supprimer"');
                quantityProduct ({
                    id: retrieveParentData.dataset.id,
                    color: retrieveParentData.dataset.color,
                    quantity: 1
                });

                itemQuantity.value = 1;
            }

            else if (Number(e.target.value) > 100) {
                alert ('Le maximum pour cet article est de 100 pièces');
                quantityProduct ({
                    id: retrieveParentData.dataset.id,
                    color: retrieveParentData.dataset.color,
                    quantity: 100
                });
                
                itemQuantity.value = 100;
            }

            else {
                // On appelle "quantityProduct()" avec les infos et la nouvelle quantité en paramètre".
                quantityProduct ({
                    id: retrieveParentData.dataset.id,
                    color: retrieveParentData.dataset.color,
                    quantity: Number(e.target.value)
                });
            }

            // On appelle "getTotalQty()" pour recalculer et afficher le total des produits ainsi que le prix total.
            getTotalQty();
        });
    })
}

// Fonction qui va créer un eventListener avec la boucle "forEach" pour écouter les clics sur chaque bouton "supprimer".
const deleteProduct = () => {

    // Selection de tous les boutons "deleteItem".
    const deleteButton = document.getElementsByClassName("deleteItem");
    const deleteButtonToLoop = Array.from(deleteButton)
    // On boucle sur chacun d'eux pour leur ajouter un ".addEventListener".
    deleteButtonToLoop.forEach(deleteItem => {
    
        deleteItem.addEventListener("click" , (event) => {
            event.preventDefault();

            // On récupère l'élément dans lequel on veut supprimer le noeud grâce a "removeChild()" ici la section cart__items.
            const cartItems = document.querySelector('#cart__items')

            // On récupère l'élément à supprimer via (Element.closest) pour sélectionner l'élément parent du bouton "supprimer".
            const retrieveParentData = deleteItem.closest('.cart__item');

            // On supprime le noeud du DOM avec la méthode ".removeChild()" avec comme paramètre l'élément à supprimer.
            cartItems.removeChild(retrieveParentData);

            // /* Puis on utilise la méthode (.filter) pour parcourir le tableau et ne garder que les éléments demandés.
            // Ici on demande à ne garder que les éléments du localStorage qui n'ont pas cet "id" et cette "color", on demande donc la suppression de cet élément.*/
            cart = cart.filter( p => p.id !== retrieveParentData.dataset.id || p.color !== retrieveParentData.dataset.color );

            // Même chose avec notre tableau cartKanaps.
            cartKanaps = cartKanaps.filter( p => p.id !== retrieveParentData.dataset.id || p.color !== retrieveParentData.dataset.color );

            // On sauvegarde les éléments restants sur le localStorage avec "saveThecart()".
            saveTheCart(cart);

            // Appel de "getTotalQty" pour mettre à jour le prix et les quantités en direct sur le DOM.
            getTotalQty();
        })
    })
}

// Fonction qui injecte le contenu du tableau [cartKanaps] dans le code de cart.html
const cartDisplay = () => {

    if (cartKanaps === null || cartKanaps == 0) {
        const emptyCart = `<h2 style="text-align: center">Désolé mais votre panier est vide... </h2> <p style="text-align: center"><a href="../html/index.html">Continuer mon shopping</a></p>`;
        document.getElementById("cart__items").innerHTML = emptyCart;     
    } 
    
    else {

        for (let i in cartKanaps) {
            document.getElementById("cart__items").innerHTML += 
            `<article class="cart__item" data-id="${cartKanaps[i].id}" data-color="${cartKanaps[i].color}">
                <div class="cart__item__img">
                    <img src="${cartKanaps[i].img}" alt="${cartKanaps[i].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${cartKanaps[i].name}</h2>
                        <p>${cartKanaps[i].color}</p>
                        <p>${cartKanaps[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartKanaps[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
        }

        console.log()
        getTotalQty();

    };
}

// PARTIE SAISIE DU FORMULAIRE
//-----------------------------------------------------------------------------------
const inputAnalyser = () => {
    //AddEventListener pour écouter chaque changement sur les différents "input" du formulaire.
    // Si changement détecté :
    firstName.addEventListener('change', () => {

        // On vérifie si la saisie est valide par le RegEx selectionné.
        // Si c'est bon, le message d'erreur vaut "Valide".
        if (nameRegex.test(firstName.value)) {
            firstName.style.border = '1px solid green';
            document.getElementById('firstNameErrorMsg').style.color = 'green';
            document.getElementById('firstNameErrorMsg').textContent = "Valide";
        
        // Sinon on affiche le message d'erreur.
        } else {
            firstName.style.border = '1px solid red';
            document.getElementById('firstNameErrorMsg').style.color = 'red';
            document.getElementById('firstNameErrorMsg').innerHTML = 'Une erreur est présente dans votre prénom';
        }
    });

    lastName.addEventListener('change', () => {
        if (nameRegex.test(lastName.value)) {
            lastName.style.border = '1px solid green';
            document.getElementById('lastNameErrorMsg').style.color = 'green';
            document.getElementById('lastNameErrorMsg').textContent = "Valide";
        } else {
            lastName.style.border = '1px solid red';
            document.getElementById('lastNameErrorMsg').style.color = 'red';
            document.getElementById('lastNameErrorMsg').innerHTML = 'Une erreur est présente dans votre Nom';
        }
    });

    address.addEventListener('change', () => {
        if (addressRegex.test(address.value)) {
            address.style.border = '1px solid green';
            document.getElementById('addressErrorMsg').style.color = 'green';
            document.getElementById('addressErrorMsg').textContent = "Valide";
        } else {
            address.style.border = '1px solid red';
            document.getElementById('addressErrorMsg').style.color = 'red';
            document.getElementById('addressErrorMsg').innerHTML = 'Une erreur est présente dans votre adresse postale';
        }
    });

    city.addEventListener('change', () => {
        if (nameRegex.test(city.value)) {
            city.style.border = '1px solid green';
            document.getElementById('cityErrorMsg').style.color = 'green';
            document.getElementById('cityErrorMsg').textContent = "Valide";
        } else {
            city.style.border = '1px solid red';
            document.getElementById('cityErrorMsg').style.color = 'red';
            document.getElementById('cityErrorMsg').innerHTML = 'Une erreur est présente dans votre ville';
        }
    });

    email.addEventListener('change', () => {
        if (emailRegex.test(email.value)) {
            email.style.border = '1px solid green';
            document.getElementById('emailErrorMsg').style.color = 'green';
            document.getElementById('emailErrorMsg').textContent = "Valide";
        } else {
            email.style.border = '1px solid red';
            document.getElementById('emailErrorMsg').style.color = 'red';
            document.getElementById('emailErrorMsg').innerHTML = 'Merci de saisir une adresse mail correcte';
        }
    });

    console.log(inputAnalyser);
};

// ENREGISTREMENT ET ENVOI DES INFORMATIONS DU FORMULAIRE ET DU PANIER
//------------------------------------------------------------------------------------
const postForm = () => {

    // Déclaration du tableau qui va recevoir les id des produits dans le panier.
    const productsId = [];
        
    // Boucle For qui intégre les id des produits dans le tableau [productsId].
    for (let products of cart) {
       productsId.push(products.id);
    }

    // Déclaration d'un objet "orderClient" qui contient "contact" les coordonnées clients, et "products" les id des produits.
    const orderClient = {
        contact : {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        },
        products : productsId,
    }
    
    console.log(postForm)
    
    // Méthode Fetch qui envoie une requête "POST" de l'objet "orderClient" formaté en JSON
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        body: JSON.stringify(orderClient),
        headers: {
            'Accept': 'application/json', 
            "Content-Type": "application/json" 
        }
    })

    // On récupère le fichier json.
    .then((response) => {

        if(response.ok) {
            response.json()

            // Redirection du visiteur vers confirmation.html avec "orderId" dans l'URL pour pouvoir la récupérer.
            .then((value) => {
                localStorage.clear();
                document.location.href = `confirmation.html?orderId=${value.orderId}`;
            })

        } else {
            console.log('Mauvaise réponse du réseau');
        }
    })

    .catch((error) => {
        console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
    });

    
};

// au clic sur le bouton "Commander !"
document.getElementById('order').addEventListener("click", (e)=> {
    e.preventDefault();
    if (cart === null || cart == 0) {
        alert("Votre panier est vide, vous ne pouvez pas passer commande !");
    } 
    // Si tous les champs sont valides et ne retournent pas d'erreur :
    else if (nameRegex.test(firstName.value) 
                && nameRegex.test(lastName.value) 
                && addressRegex.test(address.value)
                && nameRegex.test(city.value)
                && emailRegex.test(email.value)) {
                
                // On appel "postForm()" pour l'envoi du formulaire. 
                postForm();
    } 
    else {
        alert ("Un problème est survenu lors de la saisie des données...");
    }

    console.log(addEventListener)
})


// DECLARATION DES VARIABLES GLOBALES, DE LA FONCTION FETCH ET ACTIVATION DES FONCTIONS
//-----------------------------------------------------------------------------------
let cart = getFromCart();
// Déclaration d'un tableau qui récupèrera les informations via l'API des produits du localStorage.
let cartKanaps = [];

// Déclaration des ReGex.
const nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç][-/a-zA-Zàâäéèêëïîôöùûüç ]*[a-zA-Zàâäéèêëïîôöùûüç]+$/;
const addressRegex = /^[a-zA-Z0-9]+[-a-zA-Zàâäéèêëïîôöùûüç ]+[a-zA-Z]$/;
const emailRegex = /^[a-zA-Z0-9][-_.a-zA-Z0-9àâäéèêëïîôöùûüç ]+[@]{1}[a-zA-Z0-9]+[\.]{1}[a-z]{2,5}$/;

// Déclaration des variables des différents "input" du formulaire.
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');



inputAnalyser();

fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(kanapListApi => {

        // Boucle les données de l'API, et à chaque itération une 2ème boucle se lance.
        for (let i = 0; i < kanapListApi.length; i++) {

            // A chaque itération de la première boucle, on recherche une correspondance dans le localStorage.
            for (let j = 0; j < cart.length; j++) {

                if (kanapListApi[i]._id === cart[j].id) {

                    // Si une correspondance a été trouvé on ajoute l'objet "cartKanap" dans le tableau "cartKanaps".
                    let cartKanap = {
                        id: cart[j].id,
                        color: cart[j].color,
                        quantity: cart[j].quantity,
                        name: kanapListApi[i].name,
                        price: kanapListApi[i].price,
                        img: kanapListApi[i].imageUrl,
                        altTxt: kanapListApi[i].altTxt,
                    };
                    cartKanaps.push(cartKanap);
                }
            }
        }
        // Appel des fonctions d'affichage.
        cartDisplay();
        changeQuantityProduct();
        deleteProduct();

        console.log()
    })

    .catch((error) => {
        console.log(error.message);
    });