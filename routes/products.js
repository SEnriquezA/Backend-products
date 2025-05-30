const express = require('express');
const router = express.Router();
const products = require('../data/products');
const verifyToken = require('../middleware/auth');

// Obtener todos
router.get('/', (req, res) => {
  res.json(products);
});

// Obtener uno
router.get('/:id', (req, res) => {
  const p = products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(p);
});

// Crear
router.post('/', (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Actualizar
router.put('/:id', (req, res) => {
  const { name, description, price } = req.body;
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  product.name = name;
  product.description = description;
  product.price = price;
  res.json(product);
});

// Eliminar (protegido con JWT)
router.delete('/:id', verifyToken, (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  products.splice(index, 1);
  res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;
