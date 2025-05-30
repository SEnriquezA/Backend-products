const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../data/users');

const SECRET_KEY = 'mi_clave_secreta';

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });

  const exists = users.find(u => u.username === username);
  if (exists) return res.status(409).json({ message: 'El usuario ya existe' });

  users.push({
    username,
    password: bcrypt.hashSync(password, 8)
  });

  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
