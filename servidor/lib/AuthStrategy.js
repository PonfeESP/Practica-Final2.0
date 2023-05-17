import { Strategy as LocalStrategy } from 'passport-local';
import Cliente from '../models/Cliente.model.js';
import EmpresaPromotora from '../models/Empresa.model.js';

export const strategyInit = passport => {
  passport.use('local-cliente', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'contraseña'
  }, (email, contraseña, done) => {
    Cliente.query().findOne({ email: email }).then(cliente => {
      if (!cliente) return done(null, false, { error: 'Cliente desconocido' });
      cliente.verifyContraseña(String(contraseña), (err, contraseñaEsCorrecta) => {
        if (!!err) return done(err);
        if (!contraseñaEsCorrecta) return done(null, false);
        return done(null, cliente);
      });
    }).catch(err => {
      done(err);
    });
  }));

  passport.use('local-empresa', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'contraseña'
  }, (email, contraseña, done) => {
    EmpresaPromotora.query().findOne({ email: email }).then(empresa => {
      if (!empresa) return done(null, false, { error: 'Empresa desconocida' });
      empresa.verifyContraseña(String(contraseña), (err, contraseñaEsCorrecta) => {
        if (!!err) return done(err);
        if (!contraseñaEsCorrecta) return done(null, false);
        return done(null, empresa);
      });
    }).catch(err => {
      done(err);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Promise.all([
      Cliente.query().findById(id),
      EmpresaPromotora.query().findById(id)
    ]).then(([cliente, empresa]) => {
      if (cliente) {
        done(null, cliente);
      } else if (empresa) {
        done(null, empresa);
      } else {
        done(null, null);
      }
    }).catch(err => {
      done(err);
    });
  });
};

export default strategyInit;
