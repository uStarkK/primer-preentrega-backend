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


productsRouter.post("/", async (req, res, next) => {
    try {
        const data = await products.getAll()
        let newProduct = req.body;
        let findCode = (data.find((ele) => ele.code === newProduct.code))
        if (findCode) {
            return res.status(400).json({
                status: "Error",
                msg: "Error. A product with the same code you are trying to save already exists. Please try again"
            })
        }
        const requiredField = ['title', 'desc', 'code', 'price','stock', 'category']
        const hasAllFields = requiredField.every(prop => newProduct[prop]);
        if (newProduct.id == undefined && hasAllFields) {
            await products.saveProduct({ ...newProduct, status: true })
            return res.status(201).json({
                status: "Success",
                msg: "product saved",
                data: newProduct
            })} else{
                return res.status(409).json({
                    status: "Error",
                    msg: "An error occurred while trying to save the product. Check that all required fields are filled out and you are not trying to manually give an id"
                })
            }
        }catch (err) {
            throw new Error(err)
        }
    })



productsRouter.put("/:pid", async (req, res, next) => {
    try {
        const id = req.params.pid
        const data = await products.getAll()
        let updatedProduct = req.body;
        await products.updateProduct(id, updatedProduct);
    } catch (err) {
        throw new Error(err)
    }
})




















