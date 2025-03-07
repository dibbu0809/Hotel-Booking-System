const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Error fetching hotels' });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Error fetching hotel' });
  }
});

module.exports = router;