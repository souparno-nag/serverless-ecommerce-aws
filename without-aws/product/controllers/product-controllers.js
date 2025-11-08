const Product = require('../models/Product');

const getAllProducts = async (_, res) => {
    try {
        const allProducts = await Product.find({});
        if (allProducts?.length > 0) {
            res.status(200).json({
                success: true,
                message: 'List of all products',
                data: allProducts
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No products in the database',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product_id = req.params.productId;        
        const productDetailsById = await Product.find({product_id});
        
        if (!productDetailsById) {
            res.status(404).json({
                success: false,
                message: 'Product with the current ID is not present. Please send a different ID',
            });
        }

        res.status(200).json({
            success: true,
            data: productDetailsById
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const newlyCreatedProduct = await Product.create(newProduct);
        if (newlyCreatedProduct) {
            res.status(200).json({
                success: true,
                message: 'Product added successfully',
                data: newlyCreatedProduct
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
};

const deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.productId;        
    const productDetailsById = await Product.find({product_id});
    
    const deletedProduct = await Product.findByIdAndDelete(productDetailsById);

    if (!deletedProduct) {
      res.status(404).json({
        success: false,
        message: "Product is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProductData = req.body;
    const product_id = req.params.productId;        
    const productDetailsById = await Product.find({product_id});
    const updatedProduct = await Product.findByIdAndUpdate(
      productDetailsById,
      updatedProductData,
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
}