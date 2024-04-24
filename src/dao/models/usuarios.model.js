

import mongoose from 'mongoose';

const usuariosEsquema = new mongoose.Schema(
    {
        nombre: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
        rol: {
            type: String,
            enum: ['usuario', 'administrador', 'premium'],
            default: 'usuario',
        },
        carrito: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts',
        },
        last_connection: String,
        expira: Date,
    },
    {
        timestamps: {
            updatedAt: "FechaUltMod", createdAt: "FechaAlta",
        },
    }
);


export const UsuariosModelo = mongoose.model("usuarios", usuariosEsquema);
