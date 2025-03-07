import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function WebCheckIn() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState([{ name: '', aadhaarNumber: '' }]);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBookings(data.filter(booking => booking.status === 'PENDING'));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  const handleCheckIn = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/check-in`, {
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

      await fetchPendingBookings();
      setGuests([{ name: '', aadhaarNumber: '' }]);
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Web Check-in
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {bookings.map(booking => (
        <Card key={booking.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {booking.hotel.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </Typography>

            {guests.map((guest, index) => (
              <div key={index} style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <TextField
                  label="Guest Name"
                  value={guest.name}
                  onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Aadhaar Number"
                  value={guest.aadhaarNumber}
                  onChange={(e) => handleGuestChange(index, 'aadhaarNumber', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveGuest(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            ))}

            <Button 
              onClick={handleAddGuest}
              variant="outlined" 
              sx={{ mt: 2, mr: 2 }}
            >
              Add Guest
            </Button>
            <Button
              onClick={() => handleCheckIn(booking.id)}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={!guests.every(g => g.name && g.aadhaarNumber)}
            >
              Complete Check-in
            </Button>
          </CardContent>
        </Card>
      ))}

      {bookings.length === 0 && (
        <Typography>No pending bookings found for check-in</Typography>
      )}
    </Container>
  );
}

export default WebCheckIn;