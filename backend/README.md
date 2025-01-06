# API SneakR

SneakR API est une API RESTful pour la gestion de sneakers, des collections d'utilisateurs, des wishlists et d'autres fonctionnalités associées. Elle prend en charge l'authentification des utilisateurs et le contrôle d'accès basé sur les rôles.

## Table des matières

- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement du serveur](#lancement-du-serveur)
- [Documentation de l'API](#documentation-de-lapi)
  - [Authentification](#authentification)
  - [Utilisateurs](#utilisateurs)
  - [Sneakers](#sneakers)
  - [Collections](#collections)
  - [Wishlists](#wishlists)
- [Licence](#licence)

---

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <repository-url>
   cd SneakR
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement en créant un fichier `.env` :
   ```bash
   DB_HOST=adresse-de-la-base-de-donnees
   DB_PORT=port-de-la-base-de-donnees
   DB_USER=utilisateur-de-la-base-de-donnees
   DB_PASSWORD=mot-de-passe-de-la-base-de-donnees
   DB_NAME=nom-de-la-base-de-donnees
   JWT_SECRET=cle-secrete-jwt
   ```

4. Assurez-vous que votre base de données MySQL est configurée et en cours d'exécution.

---

## Lancement du serveur

Démarrez le serveur :
```bash
node index.js
```
Le serveur s'exécutera sur `http://localhost:1000`.

---

## Documentation de l'API

### Authentification

- **Inscription d'un utilisateur**
  - **POST** `/register`
  - **Corps de la requête** :
    ```json
    {
        "lastName": "Doe",
        "name": "John",
        "email": "johndoe@example.com",
        "password": "password123"
    }
    ```
  - **Réponse** :
    - `201 Created` : Utilisateur enregistré avec succès.

- **Connexion d'un utilisateur**
  - **POST** `/login`
  - **Corps de la requête** :
    ```json
    {
        "email": "johndoe@example.com",
        "password": "password123"
    }
    ```
  - **Réponse** :
    - `200 OK` : Retourne un token JWT.

---

### Utilisateurs

- **Récupérer tous les utilisateurs**
  - **GET** `/users`

- **Récupérer un utilisateur par ID**
  - **GET** `/users/:id`

- **Mettre à jour le rôle d'un utilisateur**
  - **PUT** `/users/:id`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "role": "ADMIN"
    }
    ```

- **Supprimer un utilisateur**
  - **DELETE** `/users/:id`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```

- **Récupérer la description d'un utilisateur**
  - **GET** `/users/:id/description`

- **Mettre à jour la description d'un utilisateur**
  - **PUT** `/users/:id/description`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "description": "Nouvelle description"
    }
    ```

- **Récupérer les badges d'un utilisateur**
  - **GET** `/users/:id/badges`

- **Récupérer l'historique d'un utilisateur**
  - **GET** `/users/:id/history`

---

### Sneakers

- **Récupérer toutes les sneakers**
  - **GET** `/item`

- **Récupérer une sneaker par ID**
  - **GET** `/item/:id`

- **Créer une sneaker**
  - **POST** `/item`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "brand": "Nike",
        "colorway": "White/Red",
        "estimatedMarketValue": "150.00",
        "name": "Air Max Example",
        "retailPrice": "100.00",
        "silhouette": "Air Max",
        "sku": "AM-001",
        "gender": "men",
        "image": "https://example.com/image.jpg",
        "story": "Cette sneaker est inspirée de la culture du running.",
        "UID": "123e4567-e89b-12d3-a456-426614174000"
    }
    ```

- **Mettre à jour une sneaker**
  - **PUT** `/item/:id`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "brand": "NIIIIIKOS",
        "colorway": "White/Red",
        "estimatedMarketValue": "150.00",
        "name": "Air Max Example",
        "retailPrice": "100.00",
        "silhouette": "Air Max",
        "sku": "AM-001",
        "gender": "men",
        "image": "https://example.com/image.jpg",
        "story": "Sneaker modifiée inspirée de la culture du running des années 90.",
        "UID": "123e4567-e89b-12d3-a456-426614174000"
    }
    ```

- **Supprimer une sneaker**
  - **DELETE** `/item/:id`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```

---

### Collections

- **Récupérer la collection d'un utilisateur**
  - **GET** `/collections/:userId`

- **Récupérer une sneaker dans une collection**
  - **GET** `/collections/:userId/:sneakerId`

- **Ajouter une sneaker à une collection**
  - **PUT** `/collections/:userId`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "sneakerId": 3125
    }
    ```

- **Supprimer une sneaker d'une collection**
  - **DELETE** `/collections/:userId/:sneakerId`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```

---

### Wishlists

- **Ajouter une sneaker à une wishlist**
  - **POST** `/wishlists`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```
  - **Corps de la requête** :
    ```json
    {
        "userId": 1,
        "sneakerId": 101
    }
    ```

- **Récupérer la wishlist d'un utilisateur**
  - **GET** `/wishlists/:userId`

- **Supprimer une sneaker d'une wishlist**
  - **DELETE** `/wishlists/:userId/:sneakerId`
  - **En-têtes de requête** :
    ```
    Authorization: Bearer <token>
    ```

---

## Licence

Ce projet est sous licence CC.