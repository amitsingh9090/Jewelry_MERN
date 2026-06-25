import express from 'express';
import prisma from '../prisma.js';
import { protect, restrictToAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to get or create the single CMS configuration document
async function getOrCreateCmsConfig() {
  let config = await prisma.cmsConfig.findFirst();
  if (!config) {
    config = await prisma.cmsConfig.create({
      data: {
        categories: ['Premium Jewelry', 'Temple Jewelry', 'Cultural Jewelry', 'Traditional Jewelry'],
        festivals: ['Diwali Sparkle', 'Eid Opulence', 'Navratri Heritage'],
        cultures: ['Mughal Heritage', 'South Indian Divine', 'Rajputana Royalty', 'Victorian Elegance'],
        occasions: ['Wedding Jewelry', 'Haldi Collection', 'Mehndi Collection', 'Engagement Collection', 'Reception Collection']
      }
    });
  }
  return config;
}

// 1. GET ALL CMS CONFIGS
router.get('/', async (req, res) => {
  try {
    const config = await getOrCreateCmsConfig();
    return res.status(200).json({
      status: 'success',
      config
    });
  } catch (error) {
    console.error("Get CMS config error:", error);
    return res.status(500).json({ message: 'Error loading CMS configurations.' });
  }
});

// 2. ADD CONFIG ITEM (Admin Only)
router.post('/:type', protect, restrictToAdmin, async (req, res) => {
  try {
    const { type } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name value is required.' });
    }

    if (!['categories', 'festivals', 'cultures', 'occasions'].includes(type)) {
      return res.status(400).json({ message: 'Invalid CMS configuration type.' });
    }

    const config = await getOrCreateCmsConfig();
    const currentValues = config[type] || [];

    if (currentValues.includes(name)) {
      return res.status(400).json({ message: 'Value already exists.' });
    }

    const updatedConfig = await prisma.cmsConfig.update({
      where: { id: config.id },
      data: {
        [type]: {
          set: [...currentValues, name]
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      config: updatedConfig
    });
  } catch (error) {
    console.error("Add config error:", error);
    return res.status(500).json({ message: 'Error adding CMS configuration item.' });
  }
});

// 3. DELETE CONFIG ITEM (Admin Only)
router.delete('/:type/:value', protect, restrictToAdmin, async (req, res) => {
  try {
    const { type, value } = req.params;

    if (!['categories', 'festivals', 'cultures', 'occasions'].includes(type)) {
      return res.status(400).json({ message: 'Invalid CMS configuration type.' });
    }

    const config = await getOrCreateCmsConfig();
    const currentValues = config[type] || [];

    const updatedConfig = await prisma.cmsConfig.update({
      where: { id: config.id },
      data: {
        [type]: {
          set: currentValues.filter(val => val !== value)
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      config: updatedConfig
    });
  } catch (error) {
    console.error("Delete config error:", error);
    return res.status(500).json({ message: 'Error deleting CMS configuration item.' });
  }
});

export default router;
