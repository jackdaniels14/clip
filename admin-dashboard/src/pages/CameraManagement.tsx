import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon
} from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import QRCode from 'react-qr-code';

interface Camera {
  id: string;
  cameraId: string;
  apparatus: string;
  angle: string;
  status: 'active' | 'inactive' | 'error';
  streamUrl?: string;
  settings: {
    resolution: string;
    fps: number;
    delaySeconds: number;
  };
}

const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [formData, setFormData] = useState({
    apparatus: '',
    angle: '',
    resolution: '1080p',
    fps: 60,
    delaySeconds: 30
  });

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cameras'));
      const camerasData: Camera[] = [];

      querySnapshot.forEach((doc) => {
        camerasData.push({ id: doc.id, ...doc.data() } as Camera);
      });

      setCameras(camerasData);
    } catch (error) {
      console.error('Error loading cameras:', error);
    }
  };

  const handleOpenDialog = (camera?: Camera) => {
    if (camera) {
      setSelectedCamera(camera);
      setFormData({
        apparatus: camera.apparatus,
        angle: camera.angle,
        resolution: camera.settings.resolution,
        fps: camera.settings.fps,
        delaySeconds: camera.settings.delaySeconds
      });
    } else {
      setSelectedCamera(null);
      setFormData({
        apparatus: '',
        angle: '',
        resolution: '1080p',
        fps: 60,
        delaySeconds: 30
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCamera(null);
  };

  const handleSaveCamera = async () => {
    try {
      const cameraData = {
        apparatus: formData.apparatus,
        angle: formData.angle,
        settings: {
          resolution: formData.resolution,
          fps: formData.fps,
          delaySeconds: formData.delaySeconds
        }
      };

      if (selectedCamera) {
        await updateDoc(doc(db, 'cameras', selectedCamera.id), cameraData);
      } else {
        await addDoc(collection(db, 'cameras'), {
          ...cameraData,
          status: 'inactive',
          streamUrl: null
        });
      }

      handleCloseDialog();
      loadCameras();
    } catch (error) {
      console.error('Error saving camera:', error);
    }
  };

  const handleDeleteCamera = async (cameraId: string) => {
    if (window.confirm('Are you sure you want to delete this camera?')) {
      try {
        await deleteDoc(doc(db, 'cameras', cameraId));
        loadCameras();
      } catch (error) {
        console.error('Error deleting camera:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Camera Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Camera
        </Button>
      </Box>

      <Grid container spacing={3}>
        {cameras.map((camera) => (
          <Grid item xs={12} sm={6} md={4} key={camera.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    {camera.status === 'active' ? (
                      <VideocamIcon color="success" />
                    ) : (
                      <VideocamOffIcon color="disabled" />
                    )}
                    <Typography variant="h6" ml={1}>
                      {camera.cameraId}
                    </Typography>
                  </Box>
                  <Chip
                    label={camera.status}
                    color={getStatusColor(camera.status) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  <strong>Apparatus:</strong> {camera.apparatus}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Angle:</strong> {camera.angle}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Resolution:</strong> {camera.settings.resolution} @ {camera.settings.fps}fps
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Delay:</strong> {camera.settings.delaySeconds}s
                </Typography>

                {camera.cameraId && (
                  <Box mt={2} display="flex" justifyContent="center">
                    <QRCode value={camera.cameraId} size={128} />
                  </Box>
                )}

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(camera)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteCamera(camera.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCamera ? 'Edit Camera' : 'Add New Camera'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Apparatus"
            value={formData.apparatus}
            onChange={(e) => setFormData({ ...formData, apparatus: e.target.value })}
            margin="normal"
            placeholder="e.g., Trampoline 1, Ski Jump"
          />
          <TextField
            fullWidth
            label="Angle"
            value={formData.angle}
            onChange={(e) => setFormData({ ...formData, angle: e.target.value })}
            margin="normal"
            placeholder="e.g., Front View, Side View"
          />
          <TextField
            fullWidth
            select
            label="Resolution"
            value={formData.resolution}
            onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
            margin="normal"
          >
            <MenuItem value="720p">720p</MenuItem>
            <MenuItem value="1080p">1080p</MenuItem>
            <MenuItem value="4K">4K</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="FPS"
            value={formData.fps}
            onChange={(e) => setFormData({ ...formData, fps: parseInt(e.target.value) })}
            margin="normal"
          >
            <MenuItem value={30}>30 fps</MenuItem>
            <MenuItem value={60}>60 fps</MenuItem>
            <MenuItem value={120}>120 fps</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Delay (seconds)"
            value={formData.delaySeconds}
            onChange={(e) => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCamera} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CameraManagement;
