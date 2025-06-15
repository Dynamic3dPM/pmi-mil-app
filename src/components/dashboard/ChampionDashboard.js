import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Assignment,
  Message,
  TrendingUp,
  School,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getProfilePictureUrl } from '../../utils/linkedin';
import { format } from 'date-fns';

const ChampionDashboard = () => {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      // Get profile picture URL, which will check both direct URL and LinkedIn
      const picUrl = getProfilePictureUrl(user);
      setProfilePicture(picUrl);
    }
  }, [user]);

  console.log(' ChampionDashboard - user:', user);
  
  // Note: Only getUser, getMilitaryMember, getProgress, getMilitaryBases, getChampionRegions, and getChampionAccessCode 
  // are available in the deployed AppSync schema. getChampion, getAssignments, and getActivities don't exist yet.
  
  // Since getChampion doesn't exist, we'll use the user data and create mock champion data
  const champion = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    region: 'Western Region', // Mock data
    totalMembers: 12, // Mock data
    certificationRate: 85.5, // Mock data
    assignedMembers: [], // Will be populated with mock data below
  };

  // Mock assignments data since getAssignments doesn't exist in deployed schema
  const mockAssignments = [
    {
      id: '1',
      member: {
        id: 'member1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        rank: 'Staff Sergeant',
        militaryBase: 'Fort Bragg',
      },
      progress: {
        currentPhase: 'STUDYING',
        completionPercentage: 75,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      }
    },
    {
      id: '2', 
      member: {
        id: 'member2',
        firstName: 'Michael',
        lastName: 'Chen',
        rank: 'Sergeant',
        militaryBase: 'Camp Pendleton',
      },
      progress: {
        currentPhase: 'PREPARATION',
        completionPercentage: 45,
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      }
    },
    {
      id: '3',
      member: {
        id: 'member3',
        firstName: 'Jessica',
        lastName: 'Rodriguez',
        rank: 'Corporal',
        militaryBase: 'Naval Air Station',
      },
      progress: {
        currentPhase: 'TESTING',
        completionPercentage: 90,
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      }
    }
  ];

  // Mock activities data since getActivities doesn't exist in deployed schema
  const mockActivities = [
    {
      id: 'activity1',
      type: 'PROGRESS_UPDATE',
      description: 'Jessica Rodriguez completed Module 5: Risk Management',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: 'activity2', 
      type: 'ASSIGNMENT_CREATED',
      description: 'New member Michael Chen assigned to your region',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: 'activity3',
      type: 'CERTIFICATION_ACHIEVED', 
      description: 'Sarah Johnson achieved PMP certification!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: 'activity4',
      type: 'PROGRESS_UPDATE',
      description: 'Michael Chen started Module 3: Project Planning',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    }
  ];

  console.log(' Using mock data for champion dashboard since getChampion, getAssignments, and getActivities are not available in deployed schema');

  const displayAssignments = mockAssignments;
  const displayActivities = mockActivities;
  const displayMembers = displayAssignments.map(a => a.member);

  const isLoading = false;
  const hasErrors = false;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'PREPARATION': return 'info';
      case 'STUDYING': return 'warning';
      case 'PRACTICE_TESTS': return 'secondary';
      case 'EXAM_READY': return 'success';
      case 'CERTIFIED': return 'primary';
      default: return 'default';
    }
  };

  const avatarSrc = profilePicture;

  if (isLoading) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Champion Dashboard - {user?.firstName} {user?.lastName}
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (hasErrors) {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Champion Dashboard - {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="h6" color="error">
          Error loading data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Champion Dashboard - {user?.firstName} {user?.lastName}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1 }} />
                <Typography variant="h6">Assigned Members</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="primary.main">
                  {displayAssignments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Assignments
                </Typography>
              </Box>

              <Chip 
                label={`${displayAssignments.filter(a => a.progress?.currentPhase === 'CERTIFIED').length} Certified`}
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1 }} />
                <Typography variant="h6">Certifications</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="success.main">
                  {displayAssignments.filter(a => a.progress?.currentPhase === 'CERTIFIED').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed This Month
                </Typography>
              </Box>

              <Chip 
                label={`${Math.round((displayAssignments.filter(a => a.progress?.currentPhase === 'CERTIFIED').length / Math.max(displayAssignments.length, 1)) * 100)}% Success Rate`}
                color="primary"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Average Progress</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="info.main">
                  {displayAssignments.length > 0 ? 
                    Math.round(displayAssignments.reduce((sum, a) => sum + (a.progress?.completionPercentage || 0), 0) / displayAssignments.length) : 
                    0
                  }%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </Box>

              <Chip 
                label={`${displayAssignments.filter(a => (a.progress?.completionPercentage || 0) >= 80).length} Near Completion`}
                color="warning"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ mr: 1 }} />
                <Typography variant="h6">Champion Info</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="success.main">
                  {Math.round((displayAssignments.filter(a => a.progress?.currentPhase === 'CERTIFIED').length / Math.max(displayAssignments.length, 1)) * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Certification Rate
                </Typography>
              </Box>

              <Chip 
                label={`Region: ${champion?.region || 'Unknown'}`}
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Activities</Typography>
              </Box>
              
              <List dense>
                {displayActivities.length > 0 ? displayActivities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={activity.description}
                      secondary={format(new Date(activity.createdAt), 'MMM dd, HH:mm')}
                    />
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activities"
                      secondary="Activities will appear here as you work with members"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Actions</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Message />}
                  fullWidth
                >
                  Send Broadcast Message
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<School />}
                  fullWidth
                >
                  View Progress Reports
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<People />}
                  fullWidth
                >
                  Manage Assignments
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Members Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assigned Military Members
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member</TableCell>
                      <TableCell>Rank</TableCell>
                      <TableCell>Base</TableCell>
                      <TableCell>Current Phase</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayAssignments.length > 0 ? displayAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={avatarSrc} sx={{ mr: 2, width: 32, height: 32 }}>
                              {!avatarSrc && `${assignment.member.firstName[0]}${assignment.member.lastName[0]}`}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {assignment.member.firstName} {assignment.member.lastName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {assignment.member.rank}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{assignment.member.rank}</TableCell>
                        <TableCell>{assignment.member.militaryBase}</TableCell>
                        <TableCell>
                          <Chip 
                            label={assignment.progress?.currentPhase?.replace('_', ' ') || 'Not Started'}
                            color={getPhaseColor(assignment.progress?.currentPhase)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={assignment.progress?.completionPercentage || 0}
                              color={getProgressColor(assignment.progress?.completionPercentage || 0)}
                              sx={{ flexGrow: 1, mr: 1 }}
                            />
                            <Typography variant="caption">
                              {assignment.progress?.completionPercentage || 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {assignment.progress?.lastActivity ? 
                              format(new Date(assignment.progress.lastActivity), 'MMM dd') : 
                              'No activity'
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No assigned members yet. Members will appear here once assigned.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChampionDashboard;
