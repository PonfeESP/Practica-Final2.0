import { Model } from 'objection';
import bcrypt from 'bcryptjs';

export default class Admin extends Model {
  static tableName = 'admin';

  static idColumn = 'id';

  static jsonSchema = {
    type: 'object',
    required: ['email'],

    properties: {
      id: { type: 'integer' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  };

  set unsecurePassword(unsecurePassword) {
    this.password = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10));
  }

  verifyPassword(unsecurePassword, callback) {
    return bcrypt.compare(String(unsecurePassword), String(this.password), callback);
  }
}