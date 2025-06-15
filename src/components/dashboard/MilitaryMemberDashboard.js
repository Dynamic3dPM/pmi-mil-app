import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
} from '@mui/material';
import {
  School,
  Assignment,
  Message,
  TrendingUp,
  Person,
} from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_PROGRESS, GET_ASSIGNMENTS, GET_ACTIVITIES } from '../../graphql/queries';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const MilitaryMemberDashboard = () => {
  const { user } = useAuth();
  
  const { data: progressData } = useQuery(GET_PROGRESS, {
    variables: { memberId: user?.id },
    skip: !user?.id,
  });

  const { data: assignmentsData } = useQuery(GET_ASSIGNMENTS, {
    variables: { memberId: user?.id },
    skip: !user?.id,
  });

  const { data: activitiesData } = useQuery(GET_ACTIVITIES, {
    variables: { limit: 5 },
    skip: !user?.id,
  });

  const progress = progressData?.getProgress;
  const assignments = assignmentsData?.getAssignments || [];
  const activities = activitiesData?.getActivities || [];

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1 }} />
                <Typography variant="h6">Certification Progress</Typography>
              </Box>
              
              {progress ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Progress</Typography>
                    <Typography variant="body2">{progress.completionPercentage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress.completionPercentage} 
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={progress.currentPhase?.replace('_', ' ')} 
                      color={getPhaseColor(progress.currentPhase)}
                      size="small"
                    />
                    <Chip 
                      label={`Last Activity: ${format(new Date(progress.lastActivity), 'MMM dd')}`}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {progress.practiceTestScores && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Practice Test Scores
                      </Typography>
                      {JSON.parse(progress.practiceTestScores).map((score, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Test {index + 1}</Typography>
                          <Typography variant="body2" color={score >= 70 ? 'success.main' : 'warning.main'}>
                            {score}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No progress data available. Start your certification journey today!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Champion Assignment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">Your Champion</Typography>
              </Box>
              
              {user?.assignedChampion ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {user.assignedChampion.firstName[0]}{user.assignedChampion.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {user.assignedChampion.firstName} {user.assignedChampion.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.assignedChampion.email}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  You will be assigned a champion soon.
                </Typography>
              )}
              
              <Button 
                variant="outlined" 
                startIcon={<Message />}
                fullWidth
                disabled={!user?.assignedChampion}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Recent Activities</Typography>
              </Box>
              
              <List dense>
                {activities.length > 0 ? activities.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemText
                      primary={activity.description}
                      secondary={format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
                    />
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activities"
                      secondary="Start studying to see your progress here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assignment sx={{ mr: 1 }} />
                <Typography variant="h6">Assignments</Typography>
              </Box>
              
              <List dense>
                {assignments.length > 0 ? assignments.map((assignment) => (
                  <ListItem key={assignment.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        {assignment.champion?.firstName[0]}{assignment.champion?.lastName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${assignment.champion?.firstName} ${assignment.champion?.lastName}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            Status: {assignment.status}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            Assigned: {format(new Date(assignment.assignedAt), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText
                      primary="No assignments yet"
                      secondary="You'll be assigned to a champion soon"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MilitaryMemberDashboard;
