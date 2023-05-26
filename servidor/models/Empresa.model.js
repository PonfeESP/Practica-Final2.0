import { Model } from 'objection';
import bcrypt from 'bcryptjs';

export default class EmpresaPromotora extends Model {
  static tableName = 'empresas';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: ['email'],

    properties: {
      id: { type: 'integer' },
      nombre_empresa: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      cif: { type: 'string' },
      domicilio_social: { type: 'string' },
      telefono: { type: 'string' },
      persona_responsable: { type: 'string' },
      capital_social: { type: 'integer' },
      verificada: { type: 'boolean' }
    }
  };

  set unsecurePassword(unsecurePassword) {
    this.password = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10));
  };

  verifyPassword(unsecurePassword, callback) {
    return bcrypt.compare(String(unsecurePassword), String(this.password), callback);
  };
}
