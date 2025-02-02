// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const sequelize = require('./config/database'); // Importar Sequelize
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares
app.use(helmet());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Sincronizar DB y crear admin
sequelize.sync({ alter: true }) // ¡Aquí debe funcionar!
  .then(async () => {
    const User = require('./models/User');
    const [admin, created] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL },
      defaults: {
        username: 'admin',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        es_admin: true,
        codigo_referido: 'ADMIN123',
        saldo: 0
      }
    });

    if (created) console.log('✅ Admin creado:', admin.email);
    else console.log('ℹ️ Admin ya existe');

    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error('Error DB:', err));