# API - MyShop

## Documentation de l’API Rest

### Introduction
MyShop API est une API conçue pour gérer une boutique en ligne, permettant la gestion des utilisateurs, des catégories, des produits, des paniers, et des achats. Elle offre des fonctionnalités telles que l'inscription des utilisateurs, la gestion des produits et des commandes.

### Installation

1. ***Docker*** : On l'utilise pour créer la base de données MySQL et phpMyAdmin. [Télécharger Docker](https://www.docker.com/products/docker-desktop)
2. ***Node.js*** : L'API est construite grâce Node.js. [Installer Node.js](https://nodejs.org/en)
3. ***Postman*** : On l'utilise pour tester les routes de l'API. [Télécharger Postman](https://www.postman.com/downloads/)

### Installation et Configuration

#### Étape 1 : Installer les dépendances Node.js

On utilise :
- express : Framework web pour Node.js.
- mysql2 : Connecteur MySQL pour Node.js.
- bcrypt : Bibliothèque pour le hachage de mots de passe.
- cors : Middleware pour autoriser les requêtes CORS.
- jsonwebtoken : Pour générer des tokens.
- Dotenv : Pour charger les valeures du fichier .env.

```
npm init -y
 
npm install express 
npm install mysql2
npm install bcrypt 
npm install cors
npm install jsonwebtoken
npm install dotenv
```


#### Étape 2 : Configuration de MySQL et phpMyAdmin avec Docker

1. On télécharge le fichier `docker-compose.yaml` dans le dossier du projet.
2. On lance Docker pour configurer MySQL et phpMyAdmin :

```
cd backend
docker-compose up -d
```

3. On accède à phpMyAdmin via [http://localhost:8083](http://localhost:8083) et on se connecte avec les identifiants suivants :
- ***Nom d'utilisateur*** : `root`
- ***Mot de passe*** : `root_password`

4. On crée la base de données myshop_db et ajoute les différentes tables avec les colonnes en copiant le code suivant dans l'onglet **SQL**


``` sql
CREATE DATABASE myshop_db;

USE myshop_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    image VARCHAR(255),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE purchase_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### Étape 3 : Démarrer le Serveur API

Une fois la base de données opérationnelle, on démarre le serveur API avec :

```
cd backend
node server.js
```

L'API sera disponible à l'adresse [http://localhost:1000](http://localhost:1000).


### Endpoints de l'API (URL spécifiques sur un serveur web qui permettent aux utilisateurs d'accéder à des bases de données ou des services via à l'API)

### 1. Gestion des utilisateurs

- **GET /users**  
  Récupérer tous les utilisateurs.

- **POST /users**  
  Ajouter un utilisateur.  
  **Paramètres requis (Body)** :
  - `username` : Nom de l'utilisateur.
  - `email` : Adresse e-mail unique.
  - `password` : Mot de passe de l'utilisateur.
  - `role` : Rôle de l'utilisateur (`user` ou `admin`).

- **PATCH /users/:id**  
  Modifier un utilisateur.  
  **Paramètres requis (Body)** :
  - `username` : Nom mis à jour (optionnel).
  - `email` : E-mail mis à jour (optionnel).
  - `role` : Nouveau rôle (`user` ou `admin`, optionnel).

- **DELETE /users/:id**  
  Supprimer un utilisateur spécifique.

---

### 2. Gestion des catégories

- **GET /categories**  
  Récupérer toutes les catégories.

- **POST /categories**  
  Ajouter une catégorie.  
  **Paramètres requis (Body)** :
  - `name` : Nom de la catégorie.

- **PUT /categories/:id**  
  Modifier une catégorie existante.  
  **Paramètres requis (Body)** :
  - `name` : Nouveau nom de la catégorie.

- **DELETE /categories/:id**  
  Supprimer une catégorie spécifique.

---

### 3. Gestion des produits

- **GET /products**  
  Récupérer tous les produits (pagination disponible).  
  **Paramètres optionnels (Query)** :
  - `page` : Numéro de la page (par défaut : 1).
  - `limit` : Nombre d'articles par page (par défaut : 10).

- **POST /products**  
  Ajouter un produit.  
  **Paramètres requis (Body)** :
  - `name` : Nom du produit.
  - `description` : Description du produit (optionnel).
  - `price` : Prix du produit.
  - `image` : URL de l'image du produit.
  - `category_id` : ID de la catégorie associée.

- **PUT /products/:id**  
  Modifier un produit existant.  
  **Paramètres requis (Body)** :
  - `name` : Nouveau nom (optionnel).
  - `description` : Nouvelle description (optionnel).
  - `price` : Nouveau prix (optionnel).
  - `image` : Nouvelle URL d'image (optionnel).
  - `category_id` : Nouvelle catégorie associée (optionnel).

- **DELETE /products/:id**  
  Supprimer un produit spécifique.

---

### 4. Gestion du panier

- **GET /cart/:userId**  
  Récupérer le panier d'un utilisateur spécifique.

- **POST /cart**  
  Ajouter un produit au panier.  
  **Paramètres requis (Body)** :
  - `userId` : ID de l'utilisateur.
  - `productId` : ID du produit.
  - `quantity` : Quantité à ajouter (par défaut : 1).

- **PUT /cart/increase/:userId/:productId**  
  Augmenter la quantité d'un produit dans le panier.

- **PUT /cart/decrease/:userId/:productId**  
  Diminuer la quantité d'un produit dans le panier. La quantité ne peut pas être inférieure à 1.

- **DELETE /cart/:userId/:productId**  
  Supprimer un produit spécifique du panier.

---

### 5. Historique des achats

- **GET /purchase-history/:userId**  
  Récupérer l'historique des achats pour un utilisateur spécifique.

---

## Les codes de statut HTTP

- **200 OK** : La requête a réussi et les données demandées sont retournées.
- **201 Created** : Une nouvelle ressource a été créée avec succès.
- **400 Bad Request** : La requête est mal formée ou contient des données invalides.
- **401 Unauthorized** : L'utilisateur n'est pas authentifié.
- **404 Not Found** : La ressource demandée n'existe pas.
- **500 Internal Server Error** : Une erreur inattendue est survenue sur le serveur.

---