const { User, Retiro } = require('../models');

exports.obtenerRetirosPendientes = async (req, res) => {
  try {
    const retiros = await Retiro.findAll({ 
      where: { estado: 'pendiente' },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    res.json(retiros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.aprobarRetiro = async (req, res) => {
  try {
    const retiro = await Retiro.findByPk(req.params.id);
    await retiro.update({ estado: 'aprobado' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'username', 'email', 'saldo', 'nivel1_id', 'nivel2_id']
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};