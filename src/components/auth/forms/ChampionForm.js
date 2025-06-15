import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
  Grid
} from '@mui/material';

const ChampionForm = ({
  formData,
  handleChange,
  regions = [],
  expertiseOptions = [],
  industryOptions = []
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          margin="normal"
          label="Full Name"
          name="championName"
          value={formData.championName}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Region</InputLabel>
          <Select
            name="region"
            value={formData.region}
            onChange={handleChange}
            label="Region"
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.name}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Areas of Expertise</InputLabel>
          <Select
            multiple
            name="expertise"
            value={formData.expertise || []}
            onChange={handleChange}
            input={<OutlinedInput label="Areas of Expertise" />}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </div>
            )}
          >
            {expertiseOptions.map((exp) => (
              <MenuItem key={exp} value={exp}>
                {exp}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select all that apply</FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Years of Experience"
          name="yearsExperience"
          type="number"
          value={formData.yearsExperience}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Industries</InputLabel>
          <Select
            multiple
            name="industries"
            value={formData.industries || []}
            onChange={handleChange}
            input={<OutlinedInput label="Industries" />}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </div>
            )}
          >
            {industryOptions.map((industry) => (
              <MenuItem key={industry} value={industry}>
                {industry}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select industries you have experience in</FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          margin="normal"
          label="Certifications (comma separated)"
          name="certifications"
          value={formData.certifications}
          onChange={(e) => {
            // Convert comma-separated string to array
            const certs = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
            handleChange({
              target: {
                name: 'certifications',
                value: certs
              }
            });
          }}
          helperText="E.g., PMP, ACP, PgMP, PfMP"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          margin="normal"
          label="LinkedIn Profile"
          name="linkedInProfile"
          value={formData.linkedInProfile}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/your-profile"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Available Hours Per Month"
          name="availableHours"
          type="number"
          value={formData.availableHours}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          margin="normal"
          label="Mentee Capacity"
          name="menteeCapacity"
          type="number"
          value={formData.menteeCapacity}
          onChange={handleChange}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          margin="normal"
          label="Bio"
          name="bio"
          multiline
          rows={4}
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself, your experience, and why you want to be a PMI Military Champion..."
        />
      </Grid>
    </Grid>
  );
};

export default ChampionForm;
