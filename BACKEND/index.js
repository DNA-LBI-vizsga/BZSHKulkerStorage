import express from 'express';
import cors from 'cors';
const app = express();
import leltarRouters from './routes/leltarRouter.js';
import { sequelize as _sequelize, swaggerDocs } from './config.js';
import swagger  from 'swagger-ui-express';

import "./associations/associations.js";

const swaggerUI = swagger;

app.use(express.json())

async function syncDatabase() {
    try {
        await _sequelize.sync({ force: false}); // force: false ensures it won't drop existing tables
        console.log('Database synced!');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get("/",(req,res)=>
    { res.json({message:"Minden OK"})}
)

app.use(cors())
app.use('/api', leltarRouters)
app.use(
    (err, req, res, next)=>{
    
        console.log(req.headers)
        console.log(req.statusCode)
        console.log(req.originalUrl)
        console.log(req.body)

        console.log(err.message, err.stack)
        res.status(err.statusCode || 500).json({"message":err.message})
        return    
    }
)

syncDatabase().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
});



