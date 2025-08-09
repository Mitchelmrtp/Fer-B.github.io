import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import productDetailRoutes from './src/routes/productDetailRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import ordersRoutes from './src/routes/ordersRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import questionnaireRoutes from './src/routes/questionnaireRoutes.js';
import './src/models/index.js'; 

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    return res.json({ result: 'BACKEND TIENDITA ONLINE - FUNCIONA CORRECTAMENTE ✅'})
});

// Rutas de autenticación (sin seguridad por ahora)
app.use('/auth', authRoutes);

// Rutas de usuarios
app.use('/user', userRoutes);

// Rutas de productos
app.use('/products', productRoutes);      // /products, /products/search, /products/category/:category
app.use('/product', productDetailRoutes); // /product/:id, /product/:id/related, /product/:id/stock

// Rutas de carrito
app.use('/cart', cartRoutes);

// Rutas de órdenes
app.use('/order', orderRoutes);   // /order/checkout, /order/:id
app.use('/orders', ordersRoutes); // /orders/:userId

// Rutas de dashboard
app.use('/dashboard', dashboardRoutes);

// Rutas de cuestionario
app.use('/questionnaire', questionnaireRoutes);

export default app;
