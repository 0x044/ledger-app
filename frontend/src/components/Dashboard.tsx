import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert,  CircularProgress,
  SelectChangeEvent,
  Table,
  TableBody,  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllMachines, getMachinesByDepartment, updateMachineRepairStatus, createMachine } from '../services/api';

type ApiError = {
  message: string;
  status?: number;
};

interface Machine {
  _id: string;
  name: string;
  department: string;
  status: 'operational' | 'under_repair';  repairHistory: {
    type: 'mechanical' | 'electrical';
    description: string;
    startTime: string;
    endTime: string | null;
    status: 'ongoing' | 'completed';
    updatedBy: {
      username: string;
      _id: string;
    };
  }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [repairType, setRepairType] = useState<'mechanical' | 'electrical'>('mechanical');
  const [repairDescription, setRepairDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineDepartment, setNewMachineDepartment] = useState('');
  const [creatingMachine, setCreatingMachine] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const departments = ['Dyeing', 'Finishing', 'E.T.P', 'R.O', 'M.E.E & A.T.F.D', 'Boiler', 'Garment', 'Electrical'];

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchMachines();
  }, [token, selectedDepartment, navigate]);
  const fetchMachines = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      const data = selectedDepartment === 'all'
        ? await getAllMachines(token)
        : await getMachinesByDepartment(selectedDepartment, token);
      setMachines(data);    } catch (err) {
      const error = err as Error | ApiError;
      const errorMessage = 'message' in error ? error.message : 'An error occurred while fetching machines';
      setError(errorMessage);
      if ('status' in error && error.status === 401 || errorMessage.includes('401')) {
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value);
  };
  const [shouldCloseRepair, setShouldCloseRepair] = useState(false);

  const handleRepairClick = (machine: Machine) => {
    setSelectedMachine(machine);
    setRepairType('mechanical');
    setRepairDescription('');
    setShouldCloseRepair(false);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedMachine(null);
    setRepairDescription('');
    setError(null);
  };  const handleRepairSubmit = async () => {
    if (!selectedMachine || !repairDescription.trim()) {
      setError(selectedMachine?.status === 'under_repair' 
        ? 'Please provide a resolution description' 
        : 'Please provide a repair description');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const lastRepair = selectedMachine.status === 'under_repair' && selectedMachine.repairHistory.length > 0
        ? selectedMachine.repairHistory[selectedMachine.repairHistory.length - 1]
        : null;

      await updateMachineRepairStatus(
        selectedMachine._id,
        // When closing a repair, use the type from the last repair record
        selectedMachine.status === 'under_repair' ? lastRepair?.type || 'mechanical' : repairType,
        repairDescription,
        selectedMachine.status === 'under_repair',
        token!
      );
      handleDialogClose();
      await fetchMachines();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating repair status';
      setError(errorMessage);
      if (err instanceof Error && err.message.includes('401')) {
        logout();
        navigate('/');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
    setNewMachineName('');
    setNewMachineDepartment('');
    setError(null);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setError(null);
  };

  const handleCreateMachine = async () => {
    if (!newMachineName.trim() || !newMachineDepartment) {
      setError('Please fill in all fields');
      return;
    }

    setCreatingMachine(true);
    setError(null);
    try {
      await createMachine(
        newMachineName.trim(),
        newMachineDepartment,
        token!
      );
      handleCreateDialogClose();
      await fetchMachines();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the machine';
      setError(errorMessage);
      if (err instanceof Error && err.message.includes('401')) {
        logout();
        navigate('/');
      }
    } finally {
      setCreatingMachine(false);
    }
  };

  const handleHistoryDialogClose = () => {
    setHistoryDialogOpen(false);
    setSelectedMachine(null);
  };

  if (loading && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        mb: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.3)',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <Typography variant="h4" component="h1" sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600
          }}>
            Machine Repair Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateDialogOpen}
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #21cbf3 90%)',
                }
              }}
            >
              Create Machine
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                logout();
                navigate('/');
              }}
              sx={{
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.dark',
                  borderColor: 'error.dark',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}        <FormControl 
          fullWidth 
          sx={{ 
            mb: 4,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        >
          <InputLabel id="department-select-label">Department</InputLabel>
          <Select
            labelId="department-select-label"
            id="department-select"
            value={selectedDepartment}
            label="Department"
            onChange={handleDepartmentChange}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: 2
            }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>        <Typography 
          variant="h5" 
          sx={{ 
            mt: 4, 
            mb: 2,
            color: 'warning.main',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'block',
              width: 4,
              height: 24,
              backgroundColor: 'warning.main',
              marginRight: 2,
              borderRadius: 1
            }
          }}
        >
          Machines Under Maintenance
        </Typography>
        <Box sx={{ 
            mb: 4, 
            overflowX: 'auto',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: 'background.paper',
            '@media (max-width: 600px)': {
              overflowX: 'hidden',
              border: 'none',
              backgroundColor: 'transparent'
            }
          }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'background.default',
                  '& th': {
                    fontWeight: 600,
                    color: 'text.primary'
                  }
                }}
              >
                <TableCell>Machine Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Repair Start Date</TableCell>
                <TableCell>Repair Type</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines
                .filter(machine => machine.status === 'under_repair')
                .map((machine) => (
                  <TableRow key={machine._id}>
                    <TableCell data-label="Machine Name">{machine.name}</TableCell>
                    <TableCell data-label="Department">{machine.department}</TableCell>
                    <TableCell data-label="Repair Start Date">
                      {machine.repairHistory.length > 0
                        ? new Date(
                            machine.repairHistory[machine.repairHistory.length - 1].startTime
                          ).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell data-label="Repair Type">
                      {machine.repairHistory.length > 0
                        ? machine.repairHistory[machine.repairHistory.length - 1].type.charAt(0).toUpperCase() +
                          machine.repairHistory[machine.repairHistory.length - 1].type.slice(1)
                        : 'N/A'}
                    </TableCell>
                    <TableCell data-label="Supervisor">
                      {machine.repairHistory.length > 0
                        ? machine.repairHistory[machine.repairHistory.length - 1].updatedBy.username
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleRepairClick(machine)}
                        sx={{
                          '@media (max-width: 600px)': {
                            width: 'auto',
                            minWidth: '80px'
                          }
                        }}
                      >
                        Update
                      </Button>
                      {machine.repairHistory.length > 0 && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="info"
                          onClick={() => {
                            setSelectedMachine(machine);
                            setHistoryDialogOpen(true);
                          }}
                          sx={{ 
                            ml: { xs: 1, sm: 2 },
                            '@media (max-width: 600px)': {
                              width: 'auto',
                              minWidth: '80px'
                            }
                          }}
                        >
                          History
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              {machines.filter(machine => machine.status === 'under_repair').length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No machines are currently under maintenance
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>        <Typography 
          variant="h5" 
          sx={{ 
            mb: 2,
            color: 'primary.main',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              display: 'block',
              width: 4,
              height: 24,
              backgroundColor: 'primary.main',
              marginRight: 2,
              borderRadius: 1
            }
          }}
        >
          All Machines
        </Typography><Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {machines.map((machine) => (
            <Box key={machine._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {machine.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Department: {machine.department}
                  </Typography>
                  <Typography 
                    color={machine.status === 'under_repair' ? 'error' : 'success'} 
                    gutterBottom
                  >
                    Status: {machine.status.replace('_', ' ')}
                  </Typography>                  {machine.repairHistory.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Last repair: {new Date(machine.repairHistory[machine.repairHistory.length - 1].startTime).toLocaleDateString()}
                      {machine.repairHistory[machine.repairHistory.length - 1].endTime !== null && 
                        ` (Completed: ${new Date(machine.repairHistory[machine.repairHistory.length - 1].endTime!).toLocaleDateString()})`
                      }
                    </Typography>
                  )}                  <Button
                    variant="contained"
                    color={machine.status === 'under_repair' ? 'success' : 'primary'}
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleRepairClick(machine)}
                  >
                    {machine.status === 'under_repair' ? 'Close Repair' : 'Start Repair'}
                  </Button>
                  {machine.repairHistory.length > 0 && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setSelectedMachine(machine);
                        setHistoryDialogOpen(true);
                      }}
                    >
                      View History
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMachine?.status === 'under_repair' ? 'Close Repair' : 'Start New Repair'}
          {selectedMachine && ` - ${selectedMachine.name}`}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {selectedMachine?.status !== 'under_repair' ? (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="repair-type-label">Repair Type</InputLabel>
                <Select
                  labelId="repair-type-label"
                  id="repair-type"
                  value={repairType}
                  label="Repair Type"
                  onChange={(e) => setRepairType(e.target.value as 'mechanical' | 'electrical')}
                >
                  <MenuItem value="mechanical">Mechanical</MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="normal"
                label="Issue Description"
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
                error={!!error && !repairDescription.trim()}
                helperText={error && !repairDescription.trim() ? 'Description is required' : ''}
              />
            </>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Resolution Description"
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              error={!!error && !repairDescription.trim()}
              helperText={error && !repairDescription.trim() ? 'Resolution description is required' : ''}
            />
          )}
        </DialogContent>        <DialogActions>
          <Button onClick={handleDialogClose} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleRepairSubmit} 
            variant="contained" 
            color={selectedMachine?.status === 'under_repair' ? 'success' : 'primary'}
            disabled={submitting || !repairDescription.trim()}
          >
            {submitting ? <CircularProgress size={24} /> : 
              selectedMachine?.status === 'under_repair' ? 'Close Repair' : 'Start Repair'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={createDialogOpen} 
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Create New Machine
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Machine Name"
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
            error={!!error && !newMachineName.trim()}
            helperText={error && !newMachineName.trim() ? 'Machine name is required' : ''}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="new-machine-department-label">Department</InputLabel>
            <Select
              labelId="new-machine-department-label"
              id="new-machine-department"
              value={newMachineDepartment}
              label="Department"
              onChange={(e) => setNewMachineDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose} disabled={creatingMachine}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateMachine} 
            variant="contained" 
            color="primary"
            disabled={creatingMachine || !newMachineName.trim() || !newMachineDepartment}
          >
            {creatingMachine ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>      </Dialog>      <Dialog 
        open={historyDialogOpen} 
        onClose={handleHistoryDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Repair History
          {selectedMachine && ` - ${selectedMachine.name}`}
        </DialogTitle>
        <DialogContent>
          {selectedMachine && selectedMachine.repairHistory.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {selectedMachine.repairHistory.map((repair, index) => (
                <Card key={index} sx={{ mb: 2, bgcolor: 'background.paper' }}>
                  <CardContent>                    <Typography variant="subtitle1" gutterBottom>
                      Type: {repair.type.charAt(0).toUpperCase() + repair.type.slice(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: repair.status === 'completed' ? 'success.main' : 'warning.main' }} gutterBottom>
                      Status: {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Started: {new Date(repair.startTime).toLocaleString()}
                    </Typography>
                    {repair.endTime && (
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Completed: {new Date(repair.endTime).toLocaleString()}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'info.main' }} gutterBottom>
                      Supervisor: {repair.updatedBy.username}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                      {repair.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary">No repair history available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoryDialogClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={createDialogOpen} 
        onClose={handleCreateDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Machine</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Machine Name"
            value={newMachineName}
            onChange={(e) => setNewMachineName(e.target.value)}
            error={!!error && !newMachineName.trim()}
            helperText={error && !newMachineName.trim() ? 'Machine name is required' : ''}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="new-machine-department-label">Department</InputLabel>
            <Select
              labelId="new-machine-department-label"
              value={newMachineDepartment}
              label="Department"
              onChange={(e) => setNewMachineDepartment(e.target.value)}
              error={!!error && !newMachineDepartment}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose} disabled={creatingMachine}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateMachine} 
            variant="contained" 
            color="primary"
            disabled={creatingMachine || !newMachineName.trim() || !newMachineDepartment}
          >
            {creatingMachine ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;