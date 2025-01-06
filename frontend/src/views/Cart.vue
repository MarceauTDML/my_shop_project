<template>
  <div class="cart" aria-label="Shopping Cart">
    <h1>Your Cart</h1>
    <div v-if="cart.length === 0" class="empty-cart" aria-label="Empty Cart">
      <p>Your cart is empty.</p>
    </div>
    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          class="cart-item" 
          v-for="item in cart" 
          :key="item.id" 
          aria-label="Cart Item {{ item.name }}">
          <div class="item-image" aria-label="Product Image">
            <img :src="item.image" :alt="`Image of ${item.name}`" />
          </div>
          <div class="item-details">
            <h2>{{ item.name }}</h2>
            <p class="item-price" aria-label="Price">{{ Number(item.price).toFixed(2) }} €</p>
            <div class="quantity-controls" aria-label="Quantity Controls">
              <label for="quantity-{{item.id}}">Quantity:</label>
              <button 
                @click="decreaseQuantity(item)" 
                class="quantity-btn" 
                aria-label="Decrease quantity for {{ item.name }}">-
              </button>
              <span id="quantity-{{item.id}}">{{ item.quantity }}</span>
              <button 
                @click="increaseQuantity(item)" 
                class="quantity-btn" 
                aria-label="Increase quantity for {{ item.name }}">+
              </button>
            </div>
            <button 
              @click="removeFromCart(item)" 
              class="remove-btn" 
              aria-label="Remove {{ item.name }} from cart">Remove
            </button>
          </div>
        </div>
      </div>
      <div class="cart-summary" aria-label="Order Summary">
        <h2>Order Summary</h2>
        <p>Total: <span class="total-price" aria-label="Total Price">{{ totalPrice }} €</span></p>
        <button 
          @click="checkout" 
          class="checkout-btn" 
          aria-label="Proceed to Checkout">Checkout
        </button>
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
        this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
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
        alert(error.response?.data || "Failed to increase quantity.");
      }
    },
    async decreaseQuantity(item) {
      try {
        const userId = this.$store.state.user.id;
        if (item.quantity > 1) {
          await axios.put(`http://localhost:1000/cart/decrease/${userId}/${item.id}`);
          item.quantity--;
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error.message);
        alert(error.response?.data || "Failed to decrease quantity.");
      }
    },
    async checkout() {
      try {
        const userId = this.$store.state.user.id;
        if (!this.cart || this.cart.length === 0) {
          alert("Your cart is empty.");
          return;
        }
        const cartItems = this.cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        }));
        const response = await axios.post("http://localhost:1000/checkout", {
          userId,
          cartItems,
        });
        if (response.status === 200) {
          alert("Checkout successful!");
          this.cart = [];
        }
      } catch (error) {
        console.error("Error during checkout:", error.message);
        alert("Checkout failed. Please try again.");
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
  flex-direction: row;
  justify-content: space-between;
  text-align: left;
  align-items: center;
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
    flex-direction: column;
    gap: 20px;
  }

  .cart-items {
    flex: none;
  }

  .cart-item {
    flex-direction: column;
    gap: 10px;
  }

  .item-details {
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
  }

  .remove-btn {
    align-self: flex-end;
    margin-top: 10px;
  }

  .cart-summary {
    width: 100%;
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