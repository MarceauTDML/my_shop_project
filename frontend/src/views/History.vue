<template>
  <div class="history" aria-label="Purchase History">
    <h1>Your Purchase History</h1>
    <div v-if="history.length === 0" class="empty-history" aria-label="Empty Purchase History">
      <p>No purchases yet.</p>
    </div>
    <div v-else aria-label="Purchase History List">
      <div v-for="item in history" :key="item.purchase_date" class="history-item" aria-label="Purchase Item">
        <div class="history-details" aria-label="Item Details">
          <p class="item-name" aria-label="Item Name">{{ item.name }}</p>
          <p class="item-quantity" aria-label="Quantity">{{ item.quantity }} pcs</p>
          <p class="item-price" aria-label="Price">{{ item.price }} € each</p>
        </div>
        <p class="purchase-date" aria-label="Purchase Date">Date: {{ new Date(item.purchase_date).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      history: [],
    };
  },
  methods: {
    async fetchHistory() {
      try {
        const userId = this.$store.state.user.id;
        const response = await axios.get(`http://localhost:1000/purchase-history/${userId}`);
        this.history = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('No purchase history found:', error.message);
          this.history = [];
        } else {
          console.error('Error fetching history:', error.message);
          alert('Failed to load purchase history.');
        }
      }
    },
  },
  mounted() {
    this.fetchHistory();
  },
};
</script>

<style scoped>
.history {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', Arial, sans-serif;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #826A5C;
  text-align: center;
  margin-bottom: 1.5rem;
}

.empty-history {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}

.history-item {
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.history-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #826A5C;
}

.item-quantity,
.item-price {
  font-size: 1rem;
  color: #826A5C;
}

.purchase-date {
  font-size: 0.9rem;
  color: #AE9E95;
  text-align: right;
}

@media (max-width: 768px) {
  .history {
    padding: 1rem;
  }
  .history-item {
    padding: 0.8rem;
  }
  h1 {
    font-size: 1.8rem;
  }
}
</style>