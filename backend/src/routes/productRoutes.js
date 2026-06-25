import express from 'express';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({
      status: 'success',
      products
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ message: 'Error retrieving products catalog.' });
  }
});

// 2. GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({
      status: 'success',
      product
    });
  } catch (error) {
    console.error("Get single product error:", error);
    return res.status(500).json({ message: 'Error retrieving product details.' });
  }
});

// 3. ADD PRODUCT (Admin Only)
router.post('/', protect, restrictToAdmin, async (req, res) => {
  try {
    const { 
      name, category, description, material, weight, size, dailyRent, deposit, image, occasions, festivals, culture 
    } = req.body;

    if (!name || !category || !description || !material || dailyRent === undefined || deposit === undefined) {
      return res.status(400).json({ message: 'Missing required product fields.' });
    }

    // Auto-generate numeric ID by getting max ID in DB
    const allProducts = await prisma.product.findMany({ select: { id: true } });
    const numericIds = allProducts.map(p => Number(p.id)).filter(n => !isNaN(n));
    const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
    const nextStringId = String(nextNumericId);

    const newProduct = await prisma.product.create({
      data: {
        id: nextStringId,
        name,
        category,
        description,
        material,
        weight: weight || 'N/A',
        size: size || 'Standard',
        dailyRent: Number(dailyRent),
        deposit: Number(deposit),
        image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
        occasions: occasions || [],
        festivals: festivals || [],
        culture: culture || ''
      }
    });

    return res.status(201).json({
      status: 'success',
      product: newProduct
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ message: 'Error creating product.' });
  }
});

// 4. UPDATE PRODUCT (Admin Only)
router.put('/:id', protect, restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, category, description, material, weight, size, dailyRent, deposit, image, occasions, festivals, culture 
    } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        category: category !== undefined ? category : existingProduct.category,
        description: description !== undefined ? description : existingProduct.description,
        material: material !== undefined ? material : existingProduct.material,
        weight: weight !== undefined ? weight : existingProduct.weight,
        size: size !== undefined ? size : existingProduct.size,
        dailyRent: dailyRent !== undefined ? Number(dailyRent) : existingProduct.dailyRent,
        deposit: deposit !== undefined ? Number(deposit) : existingProduct.deposit,
        image: image !== undefined ? image : existingProduct.image,
        occasions: occasions !== undefined ? occasions : existingProduct.occasions,
        festivals: festivals !== undefined ? festivals : existingProduct.festivals,
        culture: culture !== undefined ? culture : existingProduct.culture
      }
    });

    return res.status(200).json({
      status: 'success',
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: 'Error updating product details.' });
  }
});

// 5. DELETE PRODUCT (Admin Only)
router.delete('/:id', protect, restrictToAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Product removed from catalog.'
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: 'Error deleting product.' });
  }
});

export default router;
