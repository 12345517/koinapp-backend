const { User, Retiro } = require('../models');

exports.solicitarRetiro = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id);
    
    if (usuario.saldo < 60000) {
      return res.status(400).json({ error: 'Saldo mínimo para retirar: $60.000' });
    }

    await Retiro.create({
      monto: 60000,
      user_id: usuario.id,
      estado: 'pendiente'
    });

    await usuario.update({ saldo: 0 });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verPerfil = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'saldo', 'codigo_referido']
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};