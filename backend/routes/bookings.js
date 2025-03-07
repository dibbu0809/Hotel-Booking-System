const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

router.post('/', protect, async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate } = req.body;

    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(hotelId) }
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        user: {
          connect: { id: req.user.id }
        },
        hotel: {
          connect: { id: parseInt(hotelId) }
        }
      },
      include: {
        hotel: true,
        user: true
      }
    });

    console.log('Booking created:', booking);
    res.status(201).json(booking);

  } catch (error) {
    console.error('Booking error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message
    });
  }
});

router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        hotel: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.post('/:id/check-in', protect, async (req, res) => {
  try {
    const { guests } = req.body;
    const bookingId = parseInt(req.params.id);

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: req.user.id,
        status: 'PENDING'
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or already checked in' });
    }

    const checkIns = await Promise.all(
      guests.map(guest => 
        prisma.checkIn.create({
          data: {
            bookingId,
            guestName: guest.name,
            aadhaarNumber: guest.aadhaarNumber
          }
        })
      )
    );

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CHECKED_IN' }
    });

    res.json({ message: 'Check-in successful', checkIns });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Error processing check-in' });
  }
});

module.exports = router;