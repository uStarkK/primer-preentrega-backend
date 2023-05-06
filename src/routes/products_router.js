import express from 'express';
import { ProductManager } from '../class.js';

const products = new ProductManager("./products.json")
export const productsRouter = express.Router();



productsRouter.get("/", async (req, res, next) => {
    try {
        const data = await products.getAll();
        const limit = req.query.limit;
        const limitedData = limit ? data.slice(0, limit) : data
        res.status(200).json(limitedData)
    } catch (err) {
        throw new Error(err)
    }
})



productsRouter.get("/:pid", async (req, res, next) => {
    try {
        const id = parseInt(req.params.pid);
        const filteredData = await products.getProductByid(id)
        res.status(200).json(filteredData)
    } catch (err) {
        throw new Error(err)
    }
})


productsRouter.post("/", async(req, res, next) => {
    try{
        let newProduct = req.body;
        console.log (await products.saveProduct(newProduct))
        return res.status(201).json({
            status: "Success",
            msg: "product saved",
            data: newProduct
        })
    }catch(err){
        throw new Error(err)
    }
})



productsRouter.put("/:pid", async(req, res, next) =>{
    try{
        const id = req.params.pid
        const data = await products.getAll()
        let updatedProduct = req.body;
        console.log(await products.updateProduct(id, updatedProduct));
        return res.status(202).json({
            status: "Success",
            msg: "Product updated",
            data: {...updatedProduct, id: data[id-1].id, code: data[id-1].code}
        })
    }catch(err){
        throw new Error(err)
    }
})




















