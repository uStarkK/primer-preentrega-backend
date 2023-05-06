import express from 'express';
import { CartManager } from '../class.js';
import { ProductManager } from '../class.js';


const products = new ProductManager("./products.json")
const carts = new CartManager("./carts.json")
export const cartRouter = express.Router();


cartRouter.get("/", async (req, res, next) =>{
    res.status(200).json(await carts.getAll())
})


cartRouter.post("/", async (req, res, next) =>{
        try {
            const allCarts = await carts.getAll()
                await carts.saveCart({products: []})
                return res.status(201).json({
                    status: "Success",
                    msg: "cart created"
                })
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ error: 'Invalid input'});
            } else {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
})


cartRouter.get("/:cid", async (req, res, next) => {
    const allCarts = await carts.getAll();
    const cartId = req.params.cid;
    const cartFound = allCarts.find(ele => ele.id == cartId)
    if(!cartFound){
        return res.status(404).json({
            status: "Error",
            msg: "The cart you are looking for does not exist"
        })
    }
    cartFound.products.length < 1 ? res.status(200).json({
        status: "Success",
        msg: "Your cart is empty, let's start shopping!",
        cart: cartFound.products
    }) : res.status(200).json({
        products: cartFound.products
    })
})


cartRouter.post("/:cid/products/:pid", async (req, res, next) =>{
    const allCarts = await carts.getAll();
    const data = await products.getAll()
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cartFound = allCarts.find(ele => ele.id === cartId);
    if(!cartFound){
        return res.status(404).json({
            status: "Error",
            msg: "The cart you are looking for does not exist"
        })
    }
    const productFound = data.find(ele => ele.id === productId)
    if(!productFound){
        return res.status(404).json({
            status: "Error",
            msg:"Product does not exist"
        })
    }
    await carts.updateCart(cartId, productId)
    const checkProduct = cartFound.products.find(ele => ele.id == productFound.id) || 0

    if(checkProduct != 0){
        res.status(200).json({
            status: "success",
            msg: `Product's quantity increased by 1`
        })
    }else{
        res.status(200).json({
            status:"Success",
            msg:"Product added to cart",
            data: productFound
        })
    }
})



cartRouter.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})