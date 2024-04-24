

export class RegistroController{
    constructor(){}

    static async registroRender (req,res){

        let { errorMessage } = req.query;
        let { message } = req.query;
        let usuario =req.session.usuario
        let admin;
            if(usuario && usuario.rol === 'administrador'){
                admin = true;
            } else {
                admin = false;
            } 
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('registro', { errorMessage, message, login : false });
    }

    static async registroError (req,res){
        
        return res.redirect('/registro?errorMessage=Error en el proceso de registro.')
    }

    static async registro (req,res){

        let {email}=req.body
        res.redirect(`/login?message=Usuario ${email} registrado correctamente.`)
        
    }

}