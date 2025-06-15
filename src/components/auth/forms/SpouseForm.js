import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';

const SpouseForm = ({
  formData,
  handleChange,
  militaryBranches = []
}) => {
  return (
    <>
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
        Tell us about your connection to the military
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Your Relationship</InputLabel>
            <Select
              name="relationshipToMilitary"
              value={formData.relationshipToMilitary}
              onChange={handleChange}
              label="Your Relationship"
            >
              <MenuItem value="spouse">Spouse</MenuItem>
              <MenuItem value="partner">Domestic Partner</MenuItem>
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="child">Child</MenuItem>
              <MenuItem value="sibling">Sibling</MenuItem>
              <MenuItem value="other">Other Family Member</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Service Member's First Name"
            name="serviceMemberFirstName"
            value={formData.serviceMemberFirstName || ''}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Service Member's Last Name"
            name="serviceMemberLastName"
            value={formData.serviceMemberLastName || ''}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Service Member's Branch</InputLabel>
            <Select
              name="spouseBranch"
              value={formData.spouseBranch || ''}
              onChange={handleChange}
              label="Service Member's Branch"
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
          <TextField
            fullWidth
            margin="normal"
            label="Service Member's Rank"
            name="spouseRank"
            value={formData.spouseRank || ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Current/Last Duty Station"
            name="spouseBase"
            value={formData.spouseBase || ''}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            margin="normal"
            label="How can we support you?"
            name="supportNeeds"
            multiline
            rows={3}
            value={formData.supportNeeds || ''}
            onChange={handleChange}
            placeholder="Tell us about your career goals and how we can assist you..."
          />
        </Grid>
      </Grid>
    </>
  );
};

export default SpouseForm;
