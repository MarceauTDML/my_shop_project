-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb
-- Généré le : lun. 06 jan. 2025 à 22:41
-- Version du serveur : 11.5.2-MariaDB-ubu2404
-- Version de PHP : 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `myshop_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(10, 2, 3, 1),
(11, 2, 4, 1),
(12, 2, 6, 1),
(13, 2, 7, 1);

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Scented candles', '2025-01-03 10:27:57'),
(2, 'Natural care', '2025-01-03 10:27:57'),
(3, 'Decorations', '2025-01-03 10:27:57');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image`, `category_id`, `created_at`) VALUES
(1, 'Amber and Cedar Wood Candle', 'A candle with a warm, woody fragrance, perfect for creating a cocooning atmosphere. Hand-poured into a reusable smoked glass container.', 18.00, 'https://boutique.petitsfreresdespauvres.fr/wp-content/uploads/2024/09/Bougie-parfumee-a-lambre_HOME_2296_4-480x480.jpeg', 1, '2025-01-03 10:28:11'),
(2, 'Grapefruit and Basil Candle', 'A fresh, invigorating blend, ideal for sunny days. Cotton wick for a clean, even burn.', 16.00, 'https://i.etsystatic.com/43216469/r/il/f11f96/5285212608/il_570xN.5285212608_cw2v.jpg', 1, '2025-01-03 10:28:11'),
(3, 'Coconut and Tonka Bean Candle', 'A luscious, enveloping fragrance with an exotic touch. Handmade in a minimalist concrete container.', 20.00, 'https://www.ptitefrimousse.com/gestion/upload/942!152019-C.jpg', 1, '2025-01-03 10:28:11'),
(4, 'Matcha Tea Candle', 'A sweet, herbal fragrance inspired by Japanese tea ceremonies. ', 17.00, 'https://i.etsystatic.com/37495935/r/il/dcdb02/6331758348/il_fullxfull.6331758348_sry1.jpg', 1, '2025-01-03 10:28:11'),
(5, 'Lavender and Rosemary Candle', 'A soothing blend of lavender and rosemary, ideal for a moment of relaxation. Reusable ceramic container.', 18.00, 'https://130317445.cdn6.editmysite.com/uploads/1/3/0/3/130317445/s401041226863218965_p5_i6_w2400.jpeg\r\n', 1, '2025-01-03 10:28:11'),
(6, 'Cotton Flower Candle', 'A delicate, powdery fragrance that evokes the softness of fresh linen. Available as a limited edition.', 16.00, 'https://www.durance.fr/7824-image_produit/bougie-parfumee-fleur-de-coton.jpg', 1, '2025-01-03 10:28:11'),
(7, 'Ginger and Lime Candle', 'An energising candle with fresh, spicy notes, perfect for a morning boost.', 17.00, 'https://i0.wp.com/www.pur-element.fr/site/wp-content/uploads/2020/04/citron-gourmand-2.jpg?fit=1500%2C1500&ssl=1', 1, '2025-01-03 10:28:11'),
(8, 'Dark Chocolate and Cinnamon Candle', 'A gourmand, spicy fragrance, perfect for winter or cocooning moments.', 18.00, 'https://leavesandco.fr/2569-thickbox_default/chocolat-chaud-bougie-parfumee-pot-ambre.jpg', 1, '2025-01-03 10:28:11'),
(10, 'Jasmine and White Tea Candle', 'A light, refined fragrance inspired by Asian traditions.', 19.00, 'https://www.esteban.fr/6245-large_default/bougie-parfumee-rechargeable-180g.jpg', 1, '2025-01-06 22:09:18'),
(11, 'Coffee and Vanilla Exfoliating Soap', 'Handmade soap with coffee grounds for gentle exfoliation, enriched with coconut oil for optimum moisturisation.', 7.00, 'https://o-les-box.com/cdn/shop/files/savon-tranche-coffee-lover.jpg?v=1729333414&width=2048', 2, '2025-01-06 22:10:58'),
(12, 'Activated Charcoal Shampoo Bar\r\n', 'Purifying solid shampoo designed to eliminate impurities and excess sebum, while leaving hair soft.', 10.00, 'https://cfaitenfrance.fr/wp-content/uploads/2022/05/savon-charbon-actif-made-in-france.webp', 2, '2025-01-06 22:10:58'),
(13, 'Mango & Shea Moisturising Balm', 'An ultra-nourishing balm for the body and lips, with shea butter and mango oil. Convenient to take along.', 12.00, 'https://rainwaterbotanicals.com/cdn/shop/files/Amazing-Mango-Hand-_-Cuticle-Balm-Rainwater-Botanicals-1693959715343.jpg?v=1693959717&width=1946', 2, '2025-01-06 22:12:35'),
(14, 'Coconut and Shea Butter Solid Deodorant', 'A 100% natural, vegan deodorant that works all day without damaging the skin.', 12.00, 'https://alcedocosmetiques.fr/cdn/shop/files/ShootingII-21.jpg?v=1684904933', 2, '2025-01-06 22:12:35'),
(15, 'Vanilla and Monoi Body Oil', 'An oil that moisturises the skin and leaves a satin finish with an exotic fragrance.', 20.00, 'https://www.lespetitsplaisirs.fr/cdn/shop/files/Les_Petits_Plaisirs-Lot_3_Eaux_de_Toilette_Vanille_Monoi-3.jpg?v=1728639644&width=2000\r\n', 2, '2025-01-06 22:13:55'),
(16, 'Green Clay and Green Tea Face Mask', 'A purifying mask for combination skin that tightens pores and leaves a sensation of freshness.', 15.00, 'https://thenakedshop.fr/cdn/shop/products/masque-visage-cozie1_1445x.jpg?v=1613044651', 2, '2025-01-06 22:13:55'),
(17, 'Raw Textured Ceramic Vase', 'A handcrafted vase with a raw, textured finish, ideal for dried flower bouquets or minimalist compositions.', 30.00, 'https://maindora.fr/wp-content/uploads/2021/12/CE123-4_MABL.jpg', 3, '2025-01-06 22:15:20'),
(18, 'Abstract Wall Weaving', 'A modern wall decoration, mixing cotton and wool yarns in neutral tones. Handmade on a wooden frame.', 40.00, 'https://i.pinimg.com/236x/e8/a6/c5/e8a6c5e8b37998774dd8d043f0e77252.jpg', 3, '2025-01-06 22:15:20'),
(19, 'Black Rattan Sun Mirror', 'A decorative mirror with black painted rattan spokes, perfect for a modern, bohemian touch.', 35.00, 'https://www.saudaracollections.fr/3038-large_default/miroir-soleil-en-rotin-matahari.jpg', 3, '2025-01-06 22:16:30'),
(20, 'Botanical Poster on Recycled Paper', 'Poster printed on 100% recycled paper, with modern plant illustrations. Supplied unframed.', 10.00, 'https://ih1.redbubble.net/image.3524463687.2454/cposter,large,square_product,1000x1000.2.jpg', 3, '2025-01-06 22:16:30'),
(21, 'Macramé Plant Hanger', 'Macramé plant support, designed to hang your pots with elegance.', 25.00, 'https://maison-macrame.fr/cdn/shop/products/plante-macrame-suspension_2.jpg?v=1641074445', 3, '2025-01-06 22:17:52'),
(22, 'Light Wood and Black Metal Wall Clock', 'A hand-crafted clock with a minimalist, modern design, perfect for a sleek interior.', 40.00, 'https://pictureserver.net/pic_storage/pic/58/17/undef_src_sa_picid_892133_x_1000_type_color_quality_100_image.jpg?ver=10', 3, '2025-01-06 22:17:52'),
(23, 'Terrazzo Coaster Set of 4', 'Handmade coasters in colourful terrazzo, bringing a modern touch to your table.', 15.00, 'https://mymilkycandle.com/cdn/shop/files/FullSizeRender_50e901c7-906b-44c3-9a1d-f6767b322b7f.jpg?v=1704800326', 3, '2025-01-06 22:18:31');

-- --------------------------------------------------------

--
-- Structure de la table `purchase_history`
--

CREATE TABLE `purchase_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `purchase_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `purchase_history`
--

INSERT INTO `purchase_history` (`id`, `user_id`, `product_id`, `quantity`, `purchase_date`) VALUES
(1, 2, 2, 1, '2025-01-04 16:14:52'),
(2, 2, 3, 1, '2025-01-04 20:01:38'),
(3, 2, 5, 1, '2025-01-05 21:32:33'),
(4, 2, 7, 1, '2025-01-05 22:28:39'),
(5, 2, 8, 1, '2025-01-05 22:28:39');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Marceau Timbal', 'timbalmarceau@gmail.com', '$2b$10$wsJy4iE1NdgmXJsqlSZUcu.vNza6BJvF0XlluhCmU.wb43/4XfvAK', 'admin', '2025-01-04 16:03:25');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Index pour la table `purchase_history`
--
ALTER TABLE `purchase_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `purchase_history`
--
ALTER TABLE `purchase_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `purchase_history`
--
ALTER TABLE `purchase_history`
  ADD CONSTRAINT `purchase_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_history_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
