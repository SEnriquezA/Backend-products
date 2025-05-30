const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const SECRET = 'tu_secreto_jwt';

// Guardar usuarios en memoria
const users = [];

// Registro de usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Datos incompletos' });

  // Verificar si usuario existe
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Usuario ya existe' });
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// CRUD productos (simplificado)
let products = [];
let nextId = 1;

app.get('/products', (req, res) => res.json(products));

app.post('/products', (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price) return res.status(400).json({ message: 'Nombre y precio son obligatorios' });

  const product = { id: nextId++, name, description, price };
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

  const { name, description, price } = req.body;
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;

  res.json(product);
});

// Middleware para validar JWT en DELETE
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

app.delete('/products/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });

  products.splice(index, 1);
  res.json({ message: 'Producto eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
