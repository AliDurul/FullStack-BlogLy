import { Router } from "express";
import swaggerUi from 'swagger-ui-express';
import redoc from 'redoc-express';


const router = Router();

// Json
router.use('/json', (req, res) => {
    res.sendFile('/src/configs/swagger.json', { root: '.' })
});

// Swagger
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(require('../configs/swagger.json'), { swaggerOptions: { persistAuthorization: true } }));

// Redoc
router.use('/redoc', redoc({ specUrl: '/documents/json', title: "BlogLy API" }));

export default router;
