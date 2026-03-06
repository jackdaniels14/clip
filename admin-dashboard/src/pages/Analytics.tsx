import React from 'react';
import { Box, Typography } from '@mui/material';

const Analytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Analytics
      </Typography>
      <Typography color="textSecondary">
        Analytics and reports will be displayed here
      </Typography>
    </Box>
  );
};

export default Analytics;
