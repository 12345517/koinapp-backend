const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Comision } = require('../models');

const generarCodigoReferido = () => Math.random().toString(36).substr(2, 8).toUpperCase();

// Método para registrar usuarios
exports.registrarUsuario = async (req, res) => {
  try {
    const { username, email, password, codigo_referido } = req.body;
    
    // Buscar referido
    let referidorNivel1 = null;
    let referidorNivel2 = null;
    
    if (codigo_referido) {
      referidorNivel1 = await User.findOne({ 
        where: { codigo_referido } 
      });
      
      if (referidorNivel1 && referidorNivel1.nivel1_id) {
        referidorNivel2 = await User.findByPk(referidorNivel1.nivel1_id);
      }
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      nivel1_id: referidorNivel1?.id || null,
      nivel2_id: referidorNivel2?.id || null,
      codigo_referido: generarCodigoReferido()
    });

    // Calcular comisiones
    const comisiones = [];
    
    if (referidorNivel1) {
      comisiones.push({
        monto: 20000,
        user_id: referidorNivel1.id,
        nivel: 1
      });
      await referidorNivel1.increment('saldo', { by: 20000 });
    }
    
    if (referidorNivel2) {
      comisiones.push({
        monto: 10000,
        user_id: referidorNivel2.id,
        nivel: 2
      });
      await referidorNivel2.increment('saldo', { by: 10000 });
    }

    // Ganancia empresa
    comisiones.push({
      monto: 60000 - (comisiones.reduce((a, b) => a + b.monto, 0)),
      user_id: 1, // ID del admin
      nivel: 0
    });

    await Comision.bulkCreate(comisiones);

    res.status(201).json({ 
      success: true,
      user_id: user.id 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Método para el login de usuarios
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Buscar usuario por email
    const usuario = await User.findOne({ where: { email } });
    
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verificar contraseña
    const contraseñaValida = await bcrypt.compare(password, usuario.password);
    
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar token JWT
    const token = jwt.sign(
      { userId: usuario.id, es_admin: usuario.es_admin },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token,
      user: {
        id: usuario.id,
        es_admin: usuario.es_admin
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};