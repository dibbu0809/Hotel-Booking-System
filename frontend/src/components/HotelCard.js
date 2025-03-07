import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

function HotelCard({ hotel, onBookClick }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={hotel.image}
        alt={hotel.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {hotel.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {hotel.location}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          ${hotel.price} per night
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onBookClick(hotel)}
        >
          BOOK NOW
        </Button>
      </CardContent>
    </Card>
  );
}

export default HotelCard;