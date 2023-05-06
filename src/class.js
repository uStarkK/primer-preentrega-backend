import fs from "fs"
export class ProductManager {
    constructor(path) {
        this.path = path
    }

    async saveProduct(object) {
        try {
            const read = await fs.readFileSync(this.path, "utf-8");
            const data = read ? JSON.parse(read) : [];
            let id;
            let findCode = (data.find((ele) => ele.code === object.code))
            if (findCode) {
                return "Error. A product with the same code you are trying to save already exists. Please try again"
            }
            const requiredField = ['title', 'desc', 'code', 'price', 'status', 'stock', 'category']
            const hasAllFields = requiredField.every(prop => object[prop]);
            if(object.id == undefined && hasAllFields){
                data.length === 0 ?
                (id = 1)
                :
                (id = data[data.length - 1].id + 1);
                
            const newProduct = { ...object, id };
            data.push(newProduct);
            await fs.writeFileSync(this.path, JSON.stringify(data, null, 4), "utf-8")
            return newProduct;
            }else{
                return "An error occurred trying to save the product. Please check that all the required fields are filled"
            }
            
        }

        catch (e) {
            console.log(e)
            throw new Error("Something went wrong, oops", e)
        }
    }

    async getProductByid(id) {
        try {
            const read = await fs.readFileSync(this.path, "utf-8");
            const data = JSON.parse(read)
            const obj = data.find(element => element.id === id)
            if (!obj) {
                return "The specified id does not belong to any existing product. Either the id is wrong or the product does not exist"
            }
            return obj
        }
        catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    async updateProduct(id, newObject) {
        try {
            const read = await fs.readFileSync(this.path, "utf-8");
            const data = JSON.parse(read)
            const obj = data.find(element => element.id == id)
            console.log(id)
            if (!obj) {
                return "The specified id does not belong to any existing product. Either the id is wrong or the product does not exist"
            } else {
                Object.assign(obj, {...newObject, id: obj.id, code: obj.code})
                await fs.writeFileSync(this.path, JSON.stringify(data, null, 2), "utf-8");
                return "Product updated succesfully";
            }
        }
        catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    async getAll() {
        const read = await fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(read)
    }

    async deleteProduct(id) {
        try {
            let read = await this.getAllProducts()
            let item = read.find((element) => element.id === id);
            let index = read.indexOf(item);
            read.splice(index, 1);
            await fs.writeFileSync(this.path, JSON.stringify(read, null, 4), "utf-8")
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    async deleteAll() {
        try {
            await fs.writeFileSync(this.path, JSON.stringify([], null, 4), "utf-8")
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }
}


