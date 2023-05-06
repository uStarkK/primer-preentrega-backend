import express from "express";
import { productsRouter } from "./routes/products_router.js";
import { cartRouter } from "./routes/cart_router.js";
const PORT = 8080


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.listen(PORT, () => console.log(`Server on! Listening on localhost:${PORT}`))

app.get("/", (req, res, next) =>{
    res.status(200).json({message:"Yes, server's up and running"})
})
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})




