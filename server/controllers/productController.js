import {v2 as cloudinary} from 'cloudinary';
import Product from '../models/Product.js';

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files;
        
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url;
            })
        ) 

        await Product.create({...productData, image: imagesUrl});

        res.json({success: true, message: "Product Added"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}




// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({success: true, products});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const {id} = req.body;

        const product = await Product.find(id);
        res.json({success: true, product});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const {id, inStock} = req.body;
        
        await Product.findByIdAndUpdate(id, {inStock});

        res.json({success: true, message: "Stock Updated"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}



// export const addProduct = async (req, res) => {
//     try {
//         const productData = JSON.parse(req.body.productData);
//         const images = req.files;

//         if (!images || images.length === 0) {
//             return res.status(400).json({ success: false, message: "No images uploaded" });
//         }

//         const { name, description, price, offerPrice, category } = productData;

//         if (!name || !description || !price || !offerPrice || !category) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         const imagesUrl = await Promise.all(
//             images.map((file) =>
//                 cloudinary.uploader
//                     .upload(file.path, { resource_type: "image" })
//                     .then((res) => res.secure_url)
//                     .catch((err) => {
//                         throw new Error("Image upload failed: " + err.message);
//                     })
//             )
//         );

//         await Product.create({ ...productData, image: imagesUrl });

//         return res.status(200).json({ success: true, message: "Product Added" });

//     } catch (error) {
//         console.error(error.message);
//         if (!res.headersSent) {
//             return res.status(500).json({ success: false, message: error.message });
//         }
//     }
// };
