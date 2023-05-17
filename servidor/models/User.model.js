import { Model } from 'objection';
import bcrypt from 'bcryptjs';

export default class User extends Model {
    static tableName = 'user';

    static idColumn = 'id';

    static jsonSchema = {
        type: 'object',
        required: ['username'],

        properties: {
            id: {type: 'integer'},
            name: {type: 'string'},
            username: {type: 'string', default: ''},
            password: {type: 'string'}, // <-- La contraseña es una propiedad
        }
            
    };

    set unsecurePassword (unsecurePassword) {
        this.password = bcrypt.hashSync(unsecurePassword, bcrypt.genSaltSync(10)) // <-- Cifrado arreglado
      };
    
      verifyPassword (unsecurePassword, callback) {
        return bcrypt.compare(String(unsecurePassword), String(this.password), callback)
      };
    
        

}