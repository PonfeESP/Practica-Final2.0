import { Model } from 'objection';
import bcrypt from 'bcryptjs';

export default class Cliente extends Model {
  static tableName = 'clientes';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: ['email', 'nombre', 'apellidos', 'dni', 'telefono', 'fechanacimiento'],

    properties: {
      id: { type: 'integer' },
      nombre: { type: 'string' },
      apellidos: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      dni: { type: 'string' },
      telefono: { type: 'string' },
      fechanacimiento: { type: 'string', format: 'date' },
    }
  };

  set unsecurePassword(unsecurePassword) {
    this.password = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10));
  };

  verifyPassword(unsecurePassword, callback) {
    return bcrypt.compare(String(unsecurePassword), String(this.password), callback);
  };
}
