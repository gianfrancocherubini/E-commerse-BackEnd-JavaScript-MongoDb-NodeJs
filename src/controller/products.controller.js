
import validUrl from 'valid-url'
import { enviarEmail } from "../mails/mails.js";
import { ProductsService } from '../repository/products.service.js';
import { UsuariosMongoDao } from '../dao/usuariosDao.js';


const usuariosDao = new UsuariosMongoDao();
const productsService = new ProductsService();

export class ProductsController{
    constructor(){}

    static async getProducts(req, res) {
        try {
            let category = req.query.category;
            let query = {};
            let usuario = req.session.usuario;
            let admin;
    
            if (usuario && usuario.rol === 'administrador') {
                admin = true;
            } else {
                admin = false;
            }
    
            if (category) {
                query.category = category;
            }
    
            const products = await productsService.getProducts(query);
    
            let message = ''; 
    
            if (!products || products.length === 0) {
                message = 'No existen productos disponibles.'; 
            }
    
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('home', {
                products: products,
                login: req.session.usuario ? true : false,
                currentCategory: category,
                admin: admin,
                message: message // Pasa el mensaje a la vista
            });
    
        } catch (error) {
            console.log(error);
            req.logger.error('Error al obtener los productos');
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }
    
    
    static async createProduct(req, res) {
        try {
            const usuario = req.session.usuario;
    
            // Verificar si el usuario tiene el rol adecuado
            if (usuario.rol !== 'premium' && usuario.rol !== 'administrador') {
                req.logger.error('El usuario no tiene permisos para agregar productos por ser usuario general');
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: 'No tiene permisos para crear productos por ser usuario' });
            }
    
            // Resto de la función para agregar el producto
            const newProductData = req.body;
            const requiredFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category'];
    
            for (const field of requiredFields) {
                if (!newProductData[field]) {
                    req.logger.error('Todos los campos son obligatorios')
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(400).json({ error: `El campo '${field}' es obligatorio.` });
                }
            }
    
            // Validar URLs de imágenes
            const validThumbnails = newProductData.thumbnails.every(url => validUrl.isUri(url));
    
            if (!validThumbnails) {
                req.logger.error('La URL de la imagen debe ser valida')
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'La URL de la imagen no es válida.' });
            }
    
            const existingProduct = await productsService.getProductByCode(newProductData.code);
    
            if (existingProduct) {
                req.logger.error('Ya existe un producto con el codigo proporcionado')
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Ya existe un producto con el código '${newProductData.code}'.` });
            }
    
            // Establecer el owner del producto
            const owner = {
                userId: usuario.id,
                role: usuario.rol
            };
    
            newProductData.owner = owner;
    
            await productsService.createProduct(newProductData);
            req.logger.info(`Se creo el producto: ${newProductData.title}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ success: true, message: 'Producto agregado correctamente.', newProductData });
        } catch (error) {
            req.logger.error(`Error al agregar el producto, ${error}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }
        static async updateProduct (req,res){
        try {
            const usuario = req.session.usuario;
            const productId = req.params.pid;
    
            // Buscar el producto existente por _id
            const product = await productsService.getProductById(productId)
    
            if (!product) {
                req.logger.error('Producto no encontrado')
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }
    
            // Verificar si la propiedad _id está presente en el cuerpo de la solicitud
            if ('_id' in req.body) {
                req.logger.error('No se puede modificar la propiedad id')
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No se puede modificar la propiedad _id.' });
            }

            if (usuario.rol === 'usuario') {
                req.logger.error(`El usuario no tiene permiso para actualizar el producto: ${product.title}, por tener rol de usuario`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: 'No tiene permisos para modificar productos' });
            }
            
            if (usuario.rol === 'premium') {

                if (product.owner.userId.toString() !== usuario.id) {
                    req.logger.info(`No tiene permiso para actualizar el producto: ${product.title}, porque no es propio`);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(403).json({ error: 'No tiene permiso para modificar este producto proque no es propio' });
                }
            }

            const updateResult = await productsService.update(productId, req.body);
    
            if (updateResult) {
                req.logger.info(`Producto actualizado: ${productId}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ success: true, message: 'Modificación realizada.' });
            } else {
                req.logger.error('No se concreto la modificacion')
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'No se concretó la modificación.' });
            }
        } catch (error) {
            req.logger.error(`Error al actualizar el producto, ${error}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }

    static async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            const usuario = req.session.usuario;

            // Buscar el producto existente por _id
            const existingProduct = await productsService.getProductById(productId);

            if (!existingProduct) {
                req.logger.error('Producto no encontrado')
                res.setHeader('Content-Type', 'application/json');
                return res.status(404).json({ error: 'Producto no encontrado.' });
            }

            if (usuario.rol === 'usuario') {
                // Si el usuario tiene el rol de usuario, no tiene permiso para eliminar productos
                req.logger.error(`No tiene permiso para eliminar el producto: ${productId}, por ser usuario sin rol premium o administrador`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: 'No tiene permiso para eliminar el producto por ser usuario' });
            } 
         
            if (usuario.rol === 'premium') {
                // Si el usuario es premium, solo puede eliminar productos que haya creado él mismo
                if (existingProduct.owner.userId.toString() !== usuario.id) {
                    req.logger.error(`No tiene permiso para eliminar el producto: ${productId}`);
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(403).json({ error: 'No tiene permiso para eliminar el producto' });
                } 
            } 

            if (usuario.rol === 'administrador'){
                if(existingProduct.owner.userId.toString() !== usuario.id){

                    const ownerId = existingProduct.owner.userId;
                    const owner = await usuariosDao.getUsuarioById(ownerId);
                    if (!owner) {
                        req.logger.error(`No se pudo encontrar la información del propietario del producto`);
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(404).json({ error: 'No se pudo encontrar la información del propietario del producto.' });
                    }
                    const ownerEmail = owner.email;

                        await productsService.delete(productId);
                
                        const mensaje = `Estimado/a, su producto "${existingProduct.title}" ha sido eliminado por un administrador en E-commerce Cheru`;
                        await enviarEmail(ownerEmail, 'Producto eliminado', mensaje);
     
                        req.logger.info(`Producto eliminado: ${productId}, por un administrador`);
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).json({ success: true, message: 'Producto eliminado.' });
                    }
                }
             
            const deleteProductId = await productsService.delete(productId);  
            if (deleteProductId) {
                req.logger.info(`Producto eliminado: ${productId}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ success: true, message: 'Producto eliminado.' });
            }     

        } catch (error) {
            req.logger.error(`Error al eliminar el producto ${error}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`});
        }
    }
};
