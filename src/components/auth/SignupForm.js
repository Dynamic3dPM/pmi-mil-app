import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { GET_CHAMPION_REGIONS, GET_CHAMPION_ACCESS_CODE, GET_MILITARY_BASES } from '../../graphql/queries';
import { CHAMPION_SIGNUP, ACTIVE_DUTY_SIGNUP } from '../../graphql/mutations';

// Import the form components from forms subdirectory
import MilitaryMemberForm from './forms/MilitaryMemberForm';
import SpouseForm from './forms/SpouseForm';
import VeteranForm from './forms/VeteranForm';
import ChampionForm from './forms/ChampionForm';

// Define GraphQL mutations - import from mutations file instead
// const CHAMPION_SIGNUP = gql`...` (removed - imported instead)
// const ACTIVE_DUTY_SIGNUP = gql`...` (removed - imported instead)

const LIST_MILITARY_BASES = GET_MILITARY_BASES; // Use the imported query

// Define the initial form state
const getInitialFormData = () => ({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  userType: '',
  agreedToTerms: false,
  rank: '',
  militaryBranch: '',
  militaryBase: '',
  militaryBaseId: '',
  yearsOfService: '',
  specializations: [],
  assignedChampion: '',
  assignedChampionEmail: '',
  relationshipToMilitary: 'spouse',
  serviceMemberFirstName: '',
  serviceMemberLastName: '',
  spouseRank: '',
  spouseBranch: '',
  spouseBase: '',
  supportNeeds: '',
  veteranStatus: '',
  dischargeDate: null,
  lastDutyStation: '',
  militaryJob: '',
  careerInterests: '',
  assistanceNeeded: [],
  championName: '',
  region: '',
  expertise: [],
  industries: [],
  yearsExperience: '',
  certifications: [],
  bio: '',
  linkedInProfile: '',
  availableHours: '',
  menteeCapacity: '',
  accessCode: '',
});

const SignupForm = ({ onSwitchToLogin, onSignupSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { signUp: handleSignUp } = useAuth();
  const [formData, setFormData] = useState(getInitialFormData());
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessCodeModalOpen, setAccessCodeModalOpen] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const [isChampionVerified, setIsChampionVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Form components mapping
  const formComponents = {
    'military_member': MilitaryMemberForm,
    'spouse': SpouseForm,
    'veteran': VeteranForm,
    'champion': ChampionForm
  };

  // GraphQL query hooks
  const { 
    loading: basesLoading, 
    error: basesError, 
    data: basesData 
  } = useQuery(LIST_MILITARY_BASES, {
    fetchPolicy: 'cache-and-network'
  });
  
  const { 
    data: regionsData, 
    error: regionsError 
  } = useQuery(GET_CHAMPION_REGIONS);
  
  const { 
    data: accessCodeData, 
    error: accessCodeFetchError 
  } = useQuery(GET_CHAMPION_ACCESS_CODE, {
    variables: { accessCode: accessCodeInput },
    skip: !accessCodeModalOpen || !accessCodeInput,
    fetchPolicy: 'network-only'
  });

  // Process and filter military bases data - updated for schema structure
  const militaryBases = useMemo(() => {
    if (!basesData?.getMilitaryBases?.items) return [];
    
    const processedBases = basesData.getMilitaryBases.items.map(base => ({
      id: base.id,
      name: base.name,
      fullName: base.fullName,
      state: base.state,
      region: base.region,
      branch: base.branch,
      champion: base.champion,
      championEmail: base.championEmail,
      label: base.label || (base.state ? `${base.name}, ${base.state}` : base.name),
      searchText: `${base.name} ${base.fullName || ''} ${base.state || ''} ${base.region || ''} ${base.branch || ''}`.toLowerCase()
    }));

    if (!searchTerm.trim()) return processedBases;
    
    const term = searchTerm.toLowerCase();
    return processedBases.filter(base => 
      base.searchText.includes(term)
    );
  }, [basesData, searchTerm]);

  // Reference data
  const militaryBranches = [
    'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force', 'National Guard', 'Reserves'
  ];

  const militaryRanks = {
    enlisted: ['E-1', 'E-2', 'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8', 'E-9'],
    warrant: ['W-1', 'W-2', 'W-3', 'W-4', 'W-5'],
    officer: ['O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10']
  };

  const allRanks = [...militaryRanks.enlisted, ...militaryRanks.warrant, ...militaryRanks.officer];

  const specializations = [
    'Infantry', 'Artillery', 'Armor', 'Engineering', 'Signal/Communications', 'Intelligence',
    'Military Police', 'Medical', 'Aviation', 'Logistics', 'Finance', 'Human Resources',
    'Cyber Security', 'Special Operations', 'Nuclear', 'Maintenance', 'Transportation',
    'Supply/Procurement', 'Legal', 'Chaplain', 'Other'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Consulting', 'Government',
    'Non-Profit', 'Education', 'Construction', 'Energy', 'Transportation', 'Retail',
    'Telecommunications', 'Aerospace', 'Defense', 'Other'
  ];

  const expertiseOptions = [
    'Project Management', 'Leadership', 'Career Coaching', 'Technical Training',
    'Industry Networking', 'Certifications', 'Resume Building', 'Interview Preparation'
  ];

  const fallbackRegions = [
    { name: 'Juan Nieves', email: 'juan.nieves79@gmail.com', states: ['CA', 'WA', 'OR', 'NV', 'AZ'] },
    { name: 'Nathan Champion', email: 'Nathan.s.champion@gmail.com', states: ['CO', 'UT', 'ID', 'MT', 'WY', 'NM'] },
    { name: 'Brad Simmons', email: 'dir_militaryoutreach@pmipprc.org', states: ['ND', 'SD', 'NE', 'KS', 'OK'] },
    { name: 'Tim Carrender', email: 'Tim.carrender@gmail.com', states: ['TX', 'LA', 'AR', 'MS'] },
    { name: 'Earnest Evans', email: 'eevs1.ee@gmail.com', states: ['TN', 'KY', 'AL', 'GA'] },
    { name: 'Annemieke Cermely', email: 'Miekecermely@gmail.com', states: ['NC', 'SC', 'VA', 'MD', 'DE'] },
    { name: 'Chris Teodoro', email: 'cteodoro01@gmail.com', states: ['FL'] },
    { name: 'Rodrick Patterson', email: 'rrpattersoninc@gmail.com', states: ['PA', 'NJ', 'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME'] },
    { name: 'Curtis Brown', email: 'Curtisjblbrown@gmail.com', states: ['AK', 'HI'] },
    { name: 'Gina Di Nola', email: 'DrGinaDiNola@outlook.com', states: ['NM'] },
  ];

  const availableRegions = regionsData?.getChampionRegions?.items || fallbackRegions;

  // Auth and mutations - import from mutations file
  const [championSignup] = useMutation(CHAMPION_SIGNUP);
  const [activeDutySignup] = useMutation(ACTIVE_DUTY_SIGNUP);

  // Form validation
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'password':
        return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Passwords do not match';
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'userType':
        return value ? '' : 'Please select a user type';
      case 'agreedToTerms':
        return value ? '' : 'You must agree to the terms and conditions';
      default:
        return '';
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let fieldValue;
    if (type === 'checkbox') {
      fieldValue = checked;
    } else if (type === 'select-multiple') {
      fieldValue = Array.from(e.target.selectedOptions, option => option.value);
    } else {
      fieldValue = value;
    }

    if (name === 'userType') {
      if (value === 'champion' && !isChampionVerified) {
        setAccessCodeModalOpen(true);
        setFormData(prev => ({
          ...getInitialFormData(),
          email: prev.email,
          password: prev.password,
          confirmPassword: prev.confirmPassword,
          firstName: prev.firstName,
          lastName: prev.lastName,
          phoneNumber: prev.phoneNumber,
          userType: value
        }));
        return;
      }
      setFormData(prev => ({
        ...getInitialFormData(),
        email: prev.email,
        password: prev.password,
        confirmPassword: prev.confirmPassword,
        firstName: prev.firstName,
        lastName: prev.lastName,
        phoneNumber: prev.phoneNumber,
        userType: value
      }));
      setActiveStep(1);
      return;
    }
    
    if (name === 'militaryBaseId') {
      const selectedBase = militaryBases.find(base => base.id === fieldValue);
      setFormData(prev => ({
        ...prev,
        militaryBaseId: fieldValue,
        militaryBase: selectedBase?.name || '',
        region: selectedBase?.region || '',
        assignedChampion: selectedBase?.champion || '',
        assignedChampionEmail: selectedBase?.championEmail || ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle base selection
  const handleBaseSelect = (base) => {
    setFormData(prev => ({
      ...prev,
      militaryBaseId: base.id,
      militaryBase: base.name,
      assignedChampion: base.champion || '',
      assignedChampionEmail: base.championEmail || ''
    }));
  };

  // Handle step changes
  const handleNext = () => {
    const currentStepFields = getStepFields(activeStep);
    const errors = {};
    let hasErrors = false;

    currentStepFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    setFieldErrors(errors);
    
    if (!hasErrors) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  // Get fields for the current step
  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'userType'];
      case 1:
        switch (formData.userType) {
          case 'military_member':
            return ['rank', 'militaryBranch', 'militaryBaseId', 'yearsOfService'];
          case 'spouse':
            return ['relationshipToMilitary', 'serviceMemberFirstName', 'serviceMemberLastName', 'spouseBranch'];
          case 'veteran':
            return ['militaryBranch', 'rank', 'veteranStatus', 'dischargeDate'];
          case 'champion':
            return ['championName', 'region', 'expertise', 'yearsExperience'];
          default:
            return [];
        }
      case 2:
        switch (formData.userType) {
          case 'military_member':
            return ['specializations', 'phoneNumber'];
          case 'spouse':
            return ['supportNeeds', 'phoneNumber'];
          case 'veteran':
            return ['lastDutyStation', 'militaryJob', 'assistanceNeeded'];
          case 'champion':
            return ['industries', 'certifications', 'bio', 'linkedInProfile', 'availableHours', 'menteeCapacity'];
          default:
            return [];
        }
      case 3:
        return ['agreedToTerms'];
      default:
        return [];
    }
  };

  // Handle access code submission
  const handleAccessCodeSubmit = async () => {
    try {
      if (accessCodeData?.getChampionAccessCode) {
        const validAccessCode = accessCodeData.getChampionAccessCode.value || '32580';
        if (accessCodeInput === validAccessCode) {
          setIsChampionVerified(true);
          setAccessCodeModalOpen(false);
          setAccessCodeError('');
          setAccessCodeInput('');
          setFormData(prev => ({
            ...prev,
            userType: 'champion',
            accessCode: accessCodeInput
          }));
          setActiveStep(1);
          return;
        }
      }
      
      if (accessCodeInput === '32580') {
        setIsChampionVerified(true);
        setAccessCodeModalOpen(false);
        setAccessCodeError('');
        setAccessCodeInput('');
        setFormData(prev => ({
          ...prev,
          userType: 'champion',
          accessCode: accessCodeInput
        }));
        setActiveStep(1);
      } else {
        setAccessCodeError('Invalid access code. Please contact PMI Military Champions administration.');
      }
    } catch (error) {
      console.error('Error verifying access code:', error);
      setAccessCodeError('Error verifying access code. Please try again or contact support.');
    }
  };

  const handleAccessCodeCancel = () => {
    setAccessCodeModalOpen(false);
    setAccessCodeInput('');
    setAccessCodeError('');
    setFormData(prev => ({
      ...prev,
      userType: ''
    }));
    setIsChampionVerified(false);
  };

  // Form validation
  const validateForm = () => {
    setError('');
    
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'userType'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.userType === 'military_member') {
      const militaryRequired = ['militaryBranch', 'militaryBaseId'];
      const missingMilitary = militaryRequired.filter(field => !formData[field]);
      
      if (missingMilitary.length > 0) {
        setError(`Please fill in all military information including: ${missingMilitary.join(', ').replace('militaryBaseId', 'military base')}`);
        return false;
      }
    }
    
    if (formData.userType === 'champion') {
      if (!isChampionVerified) {
        setError('Champion access verification required');
        return false;
      }
      if (!formData.championName || !formData.region || !formData.yearsExperience || formData.expertise.length === 0) {
        setError('Please fill in all champion information including name, region, years of experience, and at least one expertise');
        return false;
      }
    }

    if (formData.userType === 'spouse') {
      if (!formData.serviceMemberFirstName || !formData.serviceMemberLastName || !formData.spouseBranch) {
        setError('Please fill in spouse military information including service member\'s name and branch');
        return false;
      }
    }

    if (formData.userType === 'veteran') {
      const veteranRequired = ['militaryBranch', 'veteranStatus'];
      const missingVeteran = veteranRequired.filter(field => !formData[field]);
      
      if (missingVeteran.length > 0) {
        setError(`Please fill in all veteran information including: ${missingVeteran.join(', ')}`);
        return false;
      }
    }

    if (!formData.agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      if (formData.userType === 'champion') {
        const input = {
          email: formData.email.toLowerCase(),
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userType: 'CHAMPION',
          championName: formData.championName,
          accessCode: formData.accessCode,
          region: formData.region,
          expertise: formData.expertise || [],
          industries: formData.industries || [],
          yearsExperience: parseInt(formData.yearsExperience) || 0,
          certifications: formData.certifications || [],
          bio: formData.bio || '',
          linkedInProfile: formData.linkedInProfile || '',
          availableHours: parseInt(formData.availableHours) || 0,
          menteeCapacity: parseInt(formData.menteeCapacity) || 0,
          phoneNumber: formData.phoneNumber || ''
        };
        console.log('Submitting championSignup with input:', input);
        const signupResult = await championSignup({
          variables: { input }
        });

        if (signupResult.data?.championSignup?.success) {
          console.log('Champion signup successful:', signupResult.data.championSignup);
          onSignupSuccess(formData.email, {
            userType: formData.userType,
            ...formData
          });
        } else {
          const message = signupResult.data?.championSignup?.message || 'Champion signup failed';
          console.error('Champion signup failed:', message);
          setError(message);
        }
      } else if (formData.userType === 'military_member') {
        // Handle Active Duty Military Member signup
        const militaryInput = {
          email: formData.email.toLowerCase(),
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          militaryBranch: formData.militaryBranch,
          rank: formData.rank || '',
          militaryBaseId: formData.militaryBaseId,
          yearsOfService: formData.yearsOfService ? parseInt(formData.yearsOfService) : null,
          phoneNumber: formData.phoneNumber || '',
          specializations: formData.specializations || [],
          goals: [],
          interests: formData.specializations || [], // Map specializations to interests as well
          mosCode: '', // Optional field
          dutyStation: '', // Optional field
          serviceStartDate: null,
          serviceEndDate: null,
          pmiMemberStatus: '',
          pmiId: '',
          certifications: [],
          preferredContactMethod: 'email',
          availability: '',
          timezone: ''
        };

        console.log('Submitting activeDutySignup with input:', militaryInput);
        const signupResult = await activeDutySignup({
          variables: { input: militaryInput }
        });

        console.log('Full signup result:', JSON.stringify(signupResult, null, 2));
        console.log('activeDutySignup data:', signupResult.data?.activeDutySignup);

        if (signupResult.data?.activeDutySignup?.success) {
          console.log('Military member signup successful:', signupResult.data.activeDutySignup);
          
          // Pass the correct user data to onSignupSuccess
          const userData = signupResult.data.activeDutySignup.user;
          onSignupSuccess(formData.email, {
            userType: 'MILITARY_MEMBER',
            ...userData,
            militaryBranch: formData.militaryBranch,
            militaryBaseId: formData.militaryBaseId,
            assignedChampion: userData.assignedChampion,
            assignedChampionEmail: userData.assignedChampionEmail
          });
        } else {
          const message = signupResult.data?.activeDutySignup?.message || 'Military member signup failed';
          console.error('Military member signup failed:', message);
          setError(message);
        }
      } else {
        // Handle other user types (spouse, veteran) - these would need separate mutations
        // For now, show an error message
        setError(`${formData.userType} signup is not yet implemented. Please contact support.`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render dynamic form based on user type
  const renderDynamicForm = () => {
    if (!formData.userType || (formData.userType === 'champion' && !isChampionVerified)) {
      return null;
    }

    const FormComponent = formComponents[formData.userType];
    return (
      <FormComponent
        formData={formData}
        handleChange={handleChange}
        militaryBranches={militaryBranches}
        allRanks={allRanks}
        militaryBases={militaryBases}
        basesLoading={basesLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleBaseSelect={handleBaseSelect}
        regions={availableRegions}
        expertiseOptions={expertiseOptions}
        industryOptions={industries}
        errors={fieldErrors}
      />
    );
  };

  return (
    <>
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            PMI Military Champions
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {(basesError || regionsError || accessCodeFetchError) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Using offline data for military bases and regions. Full functionality requires server connection.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Account Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={!!fieldErrors.confirmPassword}
                  helperText={fieldErrors.confirmPassword}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth margin="normal" required error={!!fieldErrors.userType}>
              <InputLabel>I am a...</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="I am a..."
              >
                <MenuItem value="military_member">Active Military Member</MenuItem>
                <MenuItem value="spouse">Military Spouse/Family Member</MenuItem>
                <MenuItem value="veteran">Military Veteran</MenuItem>
                <MenuItem value="champion">PMI Military Champion</MenuItem>
              </Select>
              <FormHelperText>{fieldErrors.userType || 'Select the category that best describes you'}</FormHelperText>
            </FormControl>

            {formData.userType && (
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                {formData.userType === 'military_member' && 'Military Information'}
                {formData.userType === 'spouse' && 'Family & Military Information'}
                {formData.userType === 'veteran' && 'Veteran Information'}
                {formData.userType === 'champion' && 'Champion Information'}
              </Typography>
            )}

            {renderDynamicForm()}

            <FormControlLabel
              control={
                <Checkbox
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                />
              }
              label="I agree to the Terms and Conditions"
              sx={{ mt: 2 }}
            />
            {fieldErrors.agreedToTerms && (
              <FormHelperText error>{fieldErrors.agreedToTerms}</FormHelperText>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog 
        open={accessCodeModalOpen} 
        onClose={handleAccessCodeCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>PMI Military Champion Access Code Required</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To register as a PMI Military Champion, you must enter the access code provided by the PMI Military Champions administration.
          </DialogContentText>
          
          {accessCodeError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {accessCodeError}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Access Code"
            type="password"
            fullWidth
            variant="outlined"
            value={accessCodeInput}
            onChange={(e) => setAccessCodeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAccessCodeSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccessCodeCancel}>Cancel</Button>
          <Button onClick={handleAccessCodeSubmit} variant="contained">
            Verify Access Code
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupForm;