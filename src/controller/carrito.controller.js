
import { enviarEmail } from "../mails/mails.js";
import { ticketMongoDao } from "../dao/ticketDao.js";
import { CarritoService } from "../repository/carrito.service.js";
import { ProductsService } from "../repository/products.service.js";
const productService = new ProductsService();
const carritoService = new CarritoService();
const ticketDao = new ticketMongoDao();

 export class CarritoController {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await carritoService.createCart();
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ success: true, message: 'Carrito creado correctamente.', cart: newCart });
        } catch (error) {
            req.logger.error('Error al crear el carrito')
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

    static async getCartById(req,res){
        try {
            const cartId = req.params.cid;
            let usuario = req.session.usuario;

            let admin;
            if(usuario && usuario.rol === 'administrador'){
                admin = true;
            } else {
                admin = false;
            }        

            if (usuario.rol === 'administrador'){
                req.logger.error('No puede ingresar a carrito porque es administrador y no puede operar sobre su propia pagina')  
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No puede ingresar a carrito porque es administrador y no puede operar sobre su propia pagina' });
                
            }

            if (!cartId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se debe proporcionar un ID de carrito válido.' });
                req.logger.error('Se debe proporcionar un ID de carrito válido.');
                return;
            }
            
            const cart = await carritoService.cartById(cartId);
            
            if (!cart) {
                req.logger.error('Carrito no encontrado')
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
            const items = cart.items;

            const totalCartPrice = () => {
                let total = 0;
                items.forEach(item => {
                    total += item.product.price * item.quantity;
                });
                return total.toFixed(2);
            };
    
            
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carrito', {carts : cart, usuario, login : true, totalCartPrice: totalCartPrice, admin: admin }) ;
            req.logger.info(`Carrito: ${cart._id}`)
        } catch (error) {
            req.logger.error("Error al obtener el carrito");
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

    static async addProductToCart(req,res){

        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
            const usuario = req.session.usuario;
        
            if (!cartId || !productId) {
              req.logger.error('Se deben proporcionar un ID de carrito y un ID de producto válidos.')  
              res.setHeader('Content-Type', 'application/json');
              res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
              return;
            }

            if (usuario.rol === 'administrador'){
                req.logger.error('No puede agregar al carrito productos por ser administrador')  
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No puede agregar al carrito productos por ser administrador' });
                
            }
            if (usuario.rol === 'premium'){
                const existingProduct = await productService.getProductById(productId);
                if(existingProduct.owner.userId.toString() === usuario.id){
                    req.logger.error(`No puede agregar al carrito productos propios`);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(403).json({ error: `No puede agregar al carrito productos propios`});
                }

            }
            const updatedCart = await carritoService.addProduct(cartId, productId, quantity);
            req.logger.info(`Producto : ${productId} agregado correctamente al Carrito`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(updatedCart);
          } catch (error) {
            req.logger.error('error al agregar el producto al carrito');
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
          }       
    }

    static async deleteProductToCart(req,res){
        try {
            const usuario = req.session.usuario;
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            if (!cartId || !productId) {
                req.logger.error('Se deben proporcionar un ID de carrito y un ID de producto válidos.')
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
                return;
            }

            if (usuario.rol === 'administrador'){
                req.logger.error('No puede eliminar prodiuctos del carrito por ser administrador')  
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No puede eliminar prodiuctos del carrito por ser administrador' });
                
            }
    
            const deleteProductToCart = await carritoService.deleteProduct(cartId, productId);
            req.logger.info(`Producto : ${productId} eliminado del carrito`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: `Producto : ${productId} eliminado de ${cartId} correctamente`});
        } catch (error) {
            req.logger.error('Error al eliminar el producto del carrito');
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

    static async deletedCart (req,res){
        try {
            const usuario = req.session.usuario;
            const cartId = req.params.cid;
                
            if (!cartId) {
                req.logger.error('Se deben proporcionar un ID de carrito válido.');
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito válido.' });
                return;
            }

            if (usuario.rol === 'usuario' && usuario.rol === 'premium'){
                req.logger.error('No puede eliminar el carrito por no tener permisos')  
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No puede eliminar el carrito por no tener permisos' });
                
            }
    
            const deleteCart = await carritoService.cartDelete(cartId);
            req.logger.info(`Carrito: ${cartId} eliminado correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(`Carrito : ${cartId} eliminado correctamente`);
        } catch (error) {
            req.logger.error('Error al eliminar el carrito');
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

    static async purchaseTicket(req, res) {
        try {
            const usuario = req.session.usuario;
            const cartId = req.params.cid;
            const cart = await carritoService.cartById(cartId);
            const email = usuario.email
    
            if (!cart) {
                req.logger.error('Carrito no encontrado.');
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
    
            const productsCarts = cart.items.slice();
            let totalAmount = 0;

            productsCarts.forEach(async item => {
                totalAmount += item.product.price * item.quantity;

                if(item.quantity <= item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock });
                }
                if(item.quantity === item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock, deleted: true });
                }
                
            });
                

            totalAmount = totalAmount.toFixed(2); 
    
            const ticket = await ticketDao.creaTicket(usuario.email, totalAmount);
    
            const ticketDetails = {
                purchaser: usuario.email,
                code: ticket.code,
                amount: totalAmount,
                purchase_datetime: ticket.purchase_datetime,
            };

            for (const item of productsCarts) {
                await carritoService.deleteProduct(cartId, item.product._id);
            }
    
            const mensaje = `Estimado/a ${usuario.nombre}, le enviamos el ticket de compra. Aquí están los detalles de su compra:
            Código: ${ticketDetails.code}
            Monto: ${ticketDetails.amount}
            Fecha de compra: ${ticketDetails.purchase_datetime}`;
            
            await enviarEmail(email, 'Ticket de compra ', mensaje);
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ ticket: ticketDetails, message: 'Ticket generado correctamente' });
            req.logger.info(`Se genero el Ticket: ${ticketDetails.code}`);

        } catch (error) {
            req.logger.error('Error al generar el ticket');
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

}
