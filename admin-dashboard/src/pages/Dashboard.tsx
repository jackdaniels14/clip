import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import {
  Videocam as VideocamIcon,
  PlayCircle as PlayCircleIcon,
  MovieCreation as MovieCreationIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Active Cameras', value: '12', icon: <VideocamIcon fontSize="large" />, color: '#1976d2' },
    { title: 'Active Sessions', value: '5', icon: <PlayCircleIcon fontSize="large" />, color: '#2e7d32' },
    { title: 'Clips Today', value: '47', icon: <MovieCreationIcon fontSize="large" />, color: '#ed6c02' },
    { title: 'Revenue Today', value: '$234', icon: <AttachMoneyIcon fontSize="large" />, color: '#9c27b0' },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          Quick Actions
        </Typography>
        <Typography color="textSecondary">
          Use the sidebar to navigate to Cameras, Sessions, or Analytics
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
