

import mongoose from 'mongoose';

const productsColeccion = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnails: {
        type: [String], 
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    category: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false 
    },
    owner: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usuarios',
            required: true
        },
        role: {
            type: String,
            enum: ['administrador', 'premium'],
            default: 'administrador'
        }
    }
}, {
    timestamps: true, 
    strict: false 
});

export const ProductEsquema = mongoose.model('products', productSchema);
