

// autorizacion de acceso a perfil luego de login
export const auth2 = (req, res, next) => {
    if (req.session.usuario) {
       return res.redirect('/perfil'); 
        
    }

    next();
};

// autorizacion de acceso a login luego de registro
export const auth = (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect('/login'); 
        
    }

    next();
};

