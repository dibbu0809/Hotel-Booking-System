import { useState, useEffect } from 'react';
import { Container, Stack, CircularProgress, Alert } from '@mui/material';
import HotelCard from './HotelCard';
import BookingForm from './BookingForm';

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/hotels');
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (hotel) => {
    setSelectedHotel(hotel);
    setOpenBooking(true);
  };

  const handleCloseBooking = () => {
    setOpenBooking(false);
    setSelectedHotel(null);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          gap: 3,
          pb: 2,
          '& > *': {
            minWidth: '300px',
            flex: '0 0 auto'
          }
        }}
      >
        {hotels.map((hotel) => (
          <HotelCard 
            key={hotel.id}
            hotel={hotel}
            onBookClick={handleBookClick}
          />
        ))}
      </Stack>

      {selectedHotel && (
        <BookingForm
          hotel={selectedHotel}
          open={openBooking}
          onClose={handleCloseBooking}
        />
      )}
    </Container>
  );
}

export default HotelList;