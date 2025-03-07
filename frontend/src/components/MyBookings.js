import { useState, useEffect } from 'react';
import { 
  Container, Typography, CircularProgress, Alert, Card, CardContent, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [guests, setGuests] = useState([{ name: '', aadhaarNumber: '' }]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWebCheckIn = (booking) => {
    setSelectedBooking(booking);
    setOpenCheckIn(true);
  };

  const handleCloseCheckIn = () => {
    setOpenCheckIn(false);
    setSelectedBooking(null);
    setGuests([{ name: '', aadhaarNumber: '' }]);
  };

  const handleAddGuest = () => {
    setGuests([...guests, { name: '', aadhaarNumber: '' }]);
  };

  const handleRemoveGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handleCheckInSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking.id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guests })
      });

      if (!response.ok) {
        throw new Error('Check-in failed');
      }

      handleCloseCheckIn();
      fetchBookings();
    } catch (error) {
      setError(error.message);
    }
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
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Typography>No bookings found</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map(booking => (
            <Grid item xs={12} md={6} key={booking.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.hotel.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {booking.hotel.location}
                  </Typography>
                  <Typography variant="body1">
                    Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Status: {booking.status}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                  {booking.status === 'PENDING' && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleWebCheckIn(booking)}
                    >
                      Web Check-in
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openCheckIn} onClose={handleCloseCheckIn} maxWidth="sm" fullWidth>
        <DialogTitle>Web Check-in: {selectedBooking?.hotel.name}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {guests.map((guest, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <TextField
                label="Guest Name"
                value={guest.name}
                onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Aadhaar Number"
                value={guest.aadhaarNumber}
                onChange={(e) => handleGuestChange(index, 'aadhaarNumber', e.target.value)}
                fullWidth
              />
              {index > 0 && (
                <IconButton onClick={() => handleRemoveGuest(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}
          <Button onClick={handleAddGuest} sx={{ mt: 2 }}>
            Add Guest
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckIn}>Cancel</Button>
          <Button 
            onClick={handleCheckInSubmit}
            variant="contained"
            disabled={!guests.every(g => g.name && g.aadhaarNumber)}
          >
            Complete Check-in
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyBookings;