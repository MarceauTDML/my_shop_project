const express = require('express');
const app = express();
const port = 1000;
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err) => {
  if (err) {
    console.error('Erreur de connexion au pool MySQL :', err);
    process.exit(1);
  }
  console.log('Connecté au pool MySQL');
});

// Helper for executing queries
const executeQuery = (sql, params, res) => {
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Erreur SQL :', err);
      res.status(500).send('Erreur serveur');
      return;
    }
    res.status(200).json(results);
  });
};

app.get('/categories', (req, res) => {
  executeQuery('SELECT * FROM categories', [], res);
});

app.get('/categories/:id', (req, res) => {
  executeQuery('SELECT * FROM categories WHERE id = ?', [req.params.id], res);
});

// Créer un utilisateur
app.post('/users', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Les champs nom, email et mot de passe sont requis.');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, hashedPassword, role || 'user'], (err) => {
      if (err) {
        console.error('Erreur lors de la création de l’utilisateur :', err.message);
        return res.status(500).send('Erreur serveur.');
      }
      res.status(201).send('Utilisateur créé avec succès.');
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error.message);
    res.status(500).send('Erreur interne du serveur.');
  }
});

app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  if (!username && !email && !role) {
    return res.status(400).send('Aucun champ à mettre à jour.');
  }

  const fields = [];
  const values = [];

  if (username) {
    fields.push('username = ?');
    values.push(username);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (role) {
    fields.push('role = ?');
    values.push(role);
  }

  values.push(id);

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Utilisateur introuvable.');
    }
    res.status(200).send('Utilisateur mis à jour avec succès.');
  });
});

// Créer une catégorie
app.post('/categories', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Le nom de la catégorie est requis.');
  }
  const sql = `INSERT INTO categories (name) VALUES (?)`;
  db.query(sql, [name], (err, results) => {
    if (err) {
      console.error('Erreur lors de la création de la catégorie :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    res.status(201).send('Catégorie créée avec succès.');
  });
});

// Modifier une catégorie
app.put('/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Le nom de la catégorie est requis.');
  }
  const sql = `UPDATE categories SET name = ? WHERE id = ?`;
  db.query(sql, [name, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification de la catégorie :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Catégorie introuvable.');
    }
    res.status(200).send('Catégorie modifiée avec succès.');
  });
});

// Supprimer une catégorie
app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM categories WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la catégorie :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Catégorie introuvable.');
    }
    res.status(200).send('Catégorie supprimée avec succès.');
  });
});

// Products
app.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    const sql = `SELECT * FROM products LIMIT ? OFFSET ?`;
    db.query(sql, [limit, offset], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des produits :', err.message);
        return res.status(500).send('Erreur serveur.');
      }
  
      db.query('SELECT COUNT(*) AS total FROM products', (countErr, countResults) => {
        if (countErr) {
          console.error('Erreur lors du comptage des produits :', countErr.message);
          return res.status(500).send('Erreur serveur.');
        }
  
        const totalItems = countResults[0].total;
        const totalPages = Math.ceil(totalItems / limit);
  
        res.status(200).json({
          data: results,
          meta: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
          },
        });
      });
    });
  });  

app.get('/products/:id', (req, res) => {
  executeQuery('SELECT * FROM products WHERE id = ?', [req.params.id], res);
});

// Créer un produit
app.post('/products', (req, res) => {
  const { name, description, price, image, category_id } = req.body;
  if (!name || !price || !image || !category_id) {
    return res.status(400).send('Tous les champs sont requis pour créer un produit.');
  }
  const sql = `INSERT INTO products (name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, description, price, image, category_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la création du produit :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    res.status(201).send('Produit créé avec succès.');
  });
});

// Modifier un produit
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category_id } = req.body;
  if (!name || !price || !image || !category_id) {
    return res.status(400).send('Tous les champs sont requis pour modifier un produit.');
  }
  const sql = `UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ? WHERE id = ?`;
  db.query(sql, [name, description, price, image, category_id, id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification du produit :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Produit introuvable.');
    }
    res.status(200).send('Produit modifié avec succès.');
  });
});

// Supprimer un produit
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM products WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit :', err.message);
      return res.status(500).send('Erreur serveur.');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Produit introuvable.');
    }
    res.status(200).send('Produit supprimé avec succès.');
  });
});

// Users
app.get('/users', (req, res) => {
  executeQuery('SELECT * FROM users', [], res);
});

app.get('/users/:id', (req, res) => {
  executeQuery('SELECT * FROM users WHERE id = ?', [req.params.id], res);
});

app.post('/users', (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) return res.status(400).send('Champs requis manquants');
  executeQuery(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role || 'user'],
    res
  );
});

app.put('/users/:id', (req, res) => {
  const { username, email, password, role } = req.body;
  executeQuery(
    'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?',
    [username, email, password, role, req.params.id],
    res
  );
});

app.delete('/users/:id', (req, res) => {
  executeQuery('DELETE FROM users WHERE id = ?', [req.params.id], res);
});

app.post('/register', async (req, res) => {
    const { lastName, name, email, password } = req.body;
    if (!lastName || !name || !email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }
    try {
        // Vérifiez si l'email existe déjà
        const checkEmailSql = `SELECT * FROM users WHERE email = ?`;
        db.query(checkEmailSql, [email], async (checkErr, results) => {
            if (checkErr) {
                console.error('Erreur lors de la vérification de l\'email :', checkErr.message);
                return res.status(500).send('Erreur serveur.');
            }
            if (results.length > 0) {
                return res.status(409).send('Cet email est déjà utilisé.');
            }

            // Hachage du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')`;
            db.query(sql, [`${name} ${lastName}`, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err.message);
                    return res.status(500).send('Erreur lors de l\'enregistrement de l\'utilisateur.');
                }
                res.status(201).send('Utilisateur enregistré avec succès.');
            });
        });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe:', error.message);
        res.status(500).send('Erreur interne du serveur.');
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'utilisateur :', err.message);
            return res.status(500).send('Erreur interne du serveur.');
        }
        if (results.length === 0) {
            return res.status(404).send('Utilisateur introuvable.');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Identifiants incorrects.');
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    });
});

app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT c.id, c.quantity, p.name, p.price, p.image, p.description
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err.message);
      return res.status(500).send('Error fetching cart.');
    }
    res.status(200).json(results);
  });
});
  
  app.post('/cart', (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    const validateProductSql = 'SELECT id FROM products WHERE id = ?';
    db.query(validateProductSql, [productId], (validateErr, results) => {
      if (validateErr || results.length === 0) {
        console.error('Invalid product ID:', productId);
        return res.status(400).send('Invalid product.');
      }
  
      const sql = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?
      `;
      db.query(sql, [userId, productId, quantity || 1, quantity || 1], (err) => {
        if (err) {
          console.error('Error adding to cart:', err.message);
          return res.status(500).send('Error adding to cart.');
        }
        res.status(201).send('Product added to cart.');
      });
    });
  });  
  
  app.put('/cart/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).send('Quantité invalide.');
    }
    const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, id], (err) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du panier :', err.message);
        return res.status(500).send('Erreur serveur.');
      }
      res.status(200).send('Quantité mise à jour.');
    });
  });
  
  app.delete('/cart/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) {
        console.error('Erreur lors de la suppression du panier :', err.message);
        return res.status(500).send('Erreur serveur.');
      }
      res.status(200).send('Produit retiré du panier.');
    });
  });

  app.post('/checkout', (req, res) => {
    const { userId, cartItems } = req.body;
  
    if (!userId || !cartItems || cartItems.length === 0) {
      return res.status(400).send('Invalid request: Missing userId or cart items.');
    }
  
    const productIds = cartItems.map((item) => item.id);
  
    const validateProductsSql = 'SELECT id FROM products WHERE id IN (?)';
    db.query(validateProductsSql, [productIds], (validateErr, results) => {
      if (validateErr) {
        console.error('Error validating products:', validateErr.message);
        return res.status(500).send('Error processing checkout.');
      }
  
      const validProductIds = results.map((row) => row.id);
      const invalidProducts = productIds.filter((id) => !validProductIds.includes(id));
  
      if (invalidProducts.length > 0) {
        console.error('Invalid product IDs in cart:', invalidProducts); // Log invalid products
        return res.status(400).send(`Invalid products in cart: ${invalidProducts.join(', ')}`);
      }
  
      // If all products are valid, proceed to insert into purchase history
      const purchaseData = cartItems.map((item) => [userId, item.id, item.quantity]);
      const purchaseHistorySql = `
        INSERT INTO purchase_history (user_id, product_id, quantity)
        VALUES ?
      `;
  
      db.query(purchaseHistorySql, [purchaseData], (err) => {
        if (err) {
          console.error('Error adding to purchase history:', err.message);
          return res.status(500).send('Error processing checkout.');
        }
  
        const clearCartSql = 'DELETE FROM cart WHERE user_id = ?';
        db.query(clearCartSql, [userId], (clearErr) => {
          if (clearErr) {
            console.error('Error clearing cart:', clearErr.message);
            return res.status(500).send('Error clearing cart.');
          }
  
          res.status(200).send('Checkout completed successfully.');
        });
      });
    });
  });    
  
  app.delete('/cart/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
  
    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], (err, results) => {
      if (err) {
        console.error('Error removing product from cart:', err.message);
        return res.status(500).send('Error removing product from cart.');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Product not found in cart.');
      }
      res.status(200).send('Product removed from cart.');
    });
  });      

  app.put('/cart/increase/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
  
    const sql = 'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], (err, results) => {
      if (err) {
        console.error('Error increasing quantity:', err.message);
        return res.status(500).send('Error increasing quantity.');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Product not found in cart.');
      }
      res.status(200).send('Quantity increased.');
    });
  });
  
  app.put('/cart/decrease/:userId/:productId', (req, res) => {
    const { userId, productId } = req.params;
  
    const sql = 'UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ? AND quantity > 1';
    db.query(sql, [userId, productId], (err, results) => {
      if (err) {
        console.error('Error decreasing quantity:', err.message);
        return res.status(500).send('Error decreasing quantity.');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Product not found in cart or quantity already at minimum.');
      }
      res.status(200).send('Quantity decreased.');
    });
  });
  

  app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
      SELECT c.id, c.quantity, p.name, p.price, p.image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.id IS NOT NULL
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching cart:', err.message);
        return res.status(500).send('Error fetching cart.');
      }
      res.status(200).json(results);
    });
  });  

  app.get('/purchase-history/:userId', (req, res) => {
    const { userId } = req.params;
  
    const sql = `
      SELECT 
        ph.id AS purchase_id,
        p.name AS product_name,
        p.price AS product_price,
        ph.quantity,
        ph.purchase_date
      FROM purchase_history ph
      JOIN products p ON ph.product_id = p.id
      WHERE ph.user_id = ?
      ORDER BY ph.purchase_date DESC
    `;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching purchase history:', err.message);
        return res.status(500).send('Error fetching purchase history.');
      }
  
      if (results.length === 0) {
        return res.status(404).send('No purchase history found.');
      }
  
      res.status(200).json(results);
    });
  });

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
