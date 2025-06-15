import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText
} from '@mui/material';
// MUI X Date Pickers v7
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const VeteranForm = ({
  formData,
  handleChange,
  militaryBranches = [],
  allRanks = []
}) => {
  const handleDateChange = (date, fieldName) => {
    handleChange({
      target: {
        name: fieldName,
        value: date
      }
    });
  };

  return (
    <>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
        Tell us about your military service
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Branch of Service</InputLabel>
            <Select
              name="militaryBranch"
              value={formData.militaryBranch || ''}
              onChange={handleChange}
              label="Branch of Service"
            >
              {militaryBranches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Highest Rank Achieved</InputLabel>
            <Select
              name="rank"
              value={formData.rank || ''}
              onChange={handleChange}
              label="Highest Rank Achieved"
            >
              {allRanks.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Years of Service"
            name="yearsOfService"
            type="number"
            value={formData.yearsOfService || ''}
            onChange={handleChange}
            inputProps={{ min: 0, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Veteran Status</InputLabel>
            <Select
              name="veteranStatus"
              value={formData.veteranStatus || ''}
              onChange={handleChange}
              label="Veteran Status"
            >
              <MenuItem value="honorably_discharged">Honorably Discharged</MenuItem>
              <MenuItem value="medically_retired">Medically Retired</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Discharge/Retirement Date"
              value={formData.dischargeDate || null}
              onChange={(date) => handleDateChange(date, 'dischargeDate')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  name="dischargeDate"
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="Last Duty Station"
            name="lastDutyStation"
            value={formData.lastDutyStation || ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="Military Occupational Specialty (MOS/AFSC/NEC)"
            name="militaryJob"
            value={formData.militaryJob || ''}
            onChange={handleChange}
            helperText="Your military job title and code (e.g., 11B Infantry, 2A6X2 Aircraft Electrical & Environmental)"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="Civilian Career Interests"
            name="careerInterests"
            multiline
            rows={3}
            value={formData.careerInterests || ''}
            onChange={handleChange}
            placeholder="What types of civilian careers are you interested in?"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel>How can we assist you?</InputLabel>
            <Select
              multiple
              name="assistanceNeeded"
              value={formData.assistanceNeeded || []}
              onChange={handleChange}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="resume">Resume Review</MenuItem>
              <MenuItem value="interview">Interview Preparation</MenuItem>
              <MenuItem value="networking">Networking</MenuItem>
              <MenuItem value="certification">Certification Guidance</MenuItem>
              <MenuItem value="education">Education Planning</MenuItem>
              <MenuItem value="career_advice">General Career Advice</MenuItem>
            </Select>
            <FormHelperText>Select all that apply</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default VeteranForm;
