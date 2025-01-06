<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <hr />
        <div class="cart-item" v-for="item in cart" :key="item.id">
          <div class="item-image">
            <img :src="item.image" />
          </div>
          <div class="item-details">
            <h2>{{ item.name }}</h2>
            <p class="item-price">{{ item.price }} €</p>
            <div class="quantity-controls">
              <label>Quantity:</label>
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <button @click="removeFromCart(item)" class="remove-btn">Remove</button>
          </div>
        </div>
        <hr />
      </div>

      <div class="cart-summary">
        <h2>Total</h2>
        <p>Subtotal: <span class="total-price">{{ totalPrice }} €</span></p>
        <button @click="checkout" class="checkout-btn">Proceed to Payment</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cart: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);
    },
  },
  methods: {
    async fetchCart() {
      try {
        const userId = this.$store.state.user.id;
        const response = await axios.get(`http://localhost:1000/cart/${userId}`);
        this.cart = response.data;
      } catch (error) {
        console.error("Error fetching cart:", error.message);
        alert("Failed to load cart.");
      }
    },
    async removeFromCart(item) {
      try {
        const userId = this.$store.state.user.id;
        await axios.delete(`http://localhost:1000/cart/${userId}/${item.id}`);
        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
        alert("Product removed from cart.");
      } catch (error) {
        console.error("Error removing product from cart:", error.message);
        alert("Failed to remove product from cart.");
      }
    },
    async increaseQuantity(item) {
      try {
        const userId = this.$store.state.user.id;
        await axios.put(`http://localhost:1000/cart/increase/${userId}/${item.id}`);
        item.quantity++;
      } catch (error) {
        console.error("Error increasing quantity:", error.message);
        alert("Failed to increase quantity.");
      }
    },
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          const userId = this.$store.state.user.id;
          await axios.put(`http://localhost:1000/cart/decrease/${userId}/${item.id}`);
          item.quantity--;
        } catch (error) {
          console.error("Error decreasing quantity:", error.message);
          alert("Failed to decrease quantity.");
        }
      } else {
        this.removeFromCart(item);
      }
    },
    async checkout() {
    try {
      const userId = this.$store.state.user?.id; // Vérifiez si l'utilisateur est connecté
      if (!userId) {
        alert('Vous devez être connecté pour payer.');
        return;
      }

      if (!this.cart || this.cart.length === 0) {
        alert('Votre panier est vide.');
        return;
      }

      // Préparer les données pour l'API
      const cartItems = this.cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      // Appeler l'API pour traiter le paiement
      const response = await axios.post('http://localhost:1000/checkout', {
        userId,
        cartItems,
      });

      if (response.status === 200) {
        alert('Paiement réussi !');
        this.cart = []; // Vider le panier après le paiement
      } else {
        alert('Échec du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error.message);
      alert(
        error.response?.data || 'Une erreur est survenue lors du traitement du paiement.'
      );
    }
  },
  },
  mounted() {
    this.fetchCart();
  },
};
</script>

<style scoped>
.cart {
  font-family: "Arial", sans-serif;
  color: #826A5C;
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.cart-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.cart-items {
  flex: 2;
}

hr {
  border: 1px solid #ddd;
  margin: 20px 0;
}

.cart-item {
  display: flex;
  padding: 20px 0;
  gap: 20px;
}

.item-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: row; /* Disposition en ligne */
  justify-content: space-between; /* Espacement entre le nom et le bouton */
  text-align: left; /* Aligner le texte à gauche */
  align-items: center; /* Aligner verticalement le texte et le bouton */
}

.item-details h2 {
  font-size: 1.2em;
  margin: 0;
}

.item-details .item-price {
  color: #826A5C;
  font-weight: bold;
  margin: 5px 0;
}

.item-description {
  margin: 5px 0;
  color: #826A5C;
}

.quantity-controls {
  margin: 10px 0;
}

.quantity-controls select {
  margin-left: 10px;
  padding: 5px;
}

.remove-btn {
  background-color: #ef796e;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cart-summary {
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fcfcfc;
  height: fit-content;
}

.cart-summary h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
}

.total-price {
  font-weight: bold;
}

.delivery select,
.promo-code input {
  width: 100%;
  margin-top: 5px;
  padding: 5px;
}

.checkout-btn {
  width: 100%;
  padding: 10px;
  background-color: #AE9E95;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.promo-code {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.promo-btn {
  padding: 5px 10px;
  background-color: #cabdb7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-content {
    flex-direction: column; /* Empiler les éléments sur les petits écrans */
    gap: 20px;
  }

  .cart-items {
    flex: none;
  }

  .cart-item {
    flex-direction: column; /* Disposition verticale des éléments */
    gap: 10px;
  }

  .item-details {
    flex-direction: column; /* Alignement des éléments en colonne pour mobile */
    justify-content: flex-start; /* Placer les éléments les uns sous les autres */
    text-align: left;
  }

  .remove-btn {
    align-self: flex-end; /* Le bouton est aligné à droite */
    margin-top: 10px;
  }

  .cart-summary {
    width: 100%; /* La section du résumé prend toute la largeur */
    padding: 10px;
    border-radius: 5px;
  }

  .checkout-btn {
    padding: 12px;
    font-size: 1.2em;
  }

  .promo-code {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
  }

  .promo-btn {
    margin-top: 10px;
  }
}
</style>