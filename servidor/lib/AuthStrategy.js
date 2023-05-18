import { Strategy as LocalStrategy } from 'passport-local';
import Cliente from '../models/Cliente.model.js';
import EmpresaPromotora from '../models/Empresa.model.js';
import Admin from '../models/Admin.model.js';

export const strategyInit = passport => {
  passport.use('local-cliente', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    Cliente.query().findOne({ email: email }).then(cliente => {
      if (!cliente) return done(null, false, { error: 'Cliente desconocido' });
      cliente.verifyPassword(String(password), (err, contraseñaEsCorrecta) => {
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
    passwordField: 'password'
  }, (email, password, done) => {
    EmpresaPromotora.query().findOne({ email: email }).then(empresa => {
      if (!empresa) return done(null, false, { error: 'Empresa desconocida' });
      empresa.verifyPassword(String(password), (err, contraseñaEsCorrecta) => {
        if (!!err) return done(err);
        if (!contraseñaEsCorrecta) return done(null, false);
        return done(null, empresa);
      });
    }).catch(err => {
      done(err);
    });
  }));

  passport.use('local-administrador', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    Admin.query().findOne({ email: email }).then(administrador => {
      if (!administrador) return done(null, false, { error: 'Administrador desconocido' });
      administrador.verifyPassword(String(password), (err, contraseñaEsCorrecta) => {
        if (!!err) return done(err);
        if (!contraseñaEsCorrecta) return done(null, false);
        return done(null, administrador);
      });
    }).catch(err => {
      done(err);
    });
  }));

  passport.serializeUser((user, done) => {
    const userType = user instanceof Cliente ? 'cliente' : user instanceof EmpresaPromotora ? 'empresa' : user instanceof Admin ? 'admin' : undefined
    done(null, {
      email: user.email,
      userType
    })
  });

  passport.deserializeUser((user, done) => {
    const dbQuery = user.userType === 'cliente'
      ? Cliente.query().findById(user.email)
      : user.userType === 'admin'
        ? Admin.query().findById(user.email)
        : null;
    if (!!dbQuery){
      dbQuery.then(res => done(null, res))
    } else done (null, null);
  });
};

export default strategyInit;