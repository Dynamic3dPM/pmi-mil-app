import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  IconButton,
  OutlinedInput,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const MilitaryMemberForm = ({
  formData,
  handleChange,
  militaryBranches = [],
  allRanks = [],
  militaryBases = [],
  basesLoading = false,
  searchTerm,
  setSearchTerm,
  handleBaseSelect,
  errors = {}
}) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth 
            margin="normal" 
            required
            error={!!errors.militaryBranch}
          >
            <InputLabel>Military Branch</InputLabel>
            <Select
              name="militaryBranch"
              value={formData.militaryBranch || ''}
              onChange={handleChange}
              label="Military Branch"
            >
              {militaryBranches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.militaryBranch || ' '}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl 
            fullWidth 
            margin="normal" 
            required
            error={!!errors.rank}
          >
            <InputLabel>Rank</InputLabel>
            <Select
              name="rank"
              value={formData.rank || ''}
              onChange={handleChange}
              label="Rank"
            >
              {allRanks.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.rank || ' '}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      <FormControl 
        fullWidth 
        margin="normal" 
        required
        error={!!errors.militaryBaseId}
      >
        <InputLabel>Military Base</InputLabel>
        <Select
          name="militaryBaseId"
          value={formData.militaryBaseId || ''}
          onChange={handleChange}
          label="Military Base"
          disabled={basesLoading}
          inputProps={{
            'aria-label': 'Select military base',
            'aria-busy': basesLoading ? 'true' : 'false'
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                width: 400,
              },
            },
          }}
          renderValue={(selected) => {
            if (!selected) return '';
            const base = militaryBases.find(b => b.id === selected);
            return base ? base.label : '';
          }}
        >
          <div style={{ padding: '8px 16px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search bases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" style={{ marginRight: 8 }} />,
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    style={{ marginRight: -12 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </div>
          {basesLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : militaryBases.length > 0 ? (
            militaryBases.map((base) => (
              <MenuItem 
                key={base.id} 
                value={base.id}
                onClick={() => handleBaseSelect(base)}
              >
                {base.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No bases found matching your search</MenuItem>
          )}
        </Select>
        {formData.militaryBaseId && formData.assignedChampion && (
          <FormHelperText>
            Your assigned PMI Champion: {formData.assignedChampion} ({formData.assignedChampionEmail})
          </FormHelperText>
        )}
        {errors.militaryBaseId && (
          <FormHelperText error>{errors.militaryBaseId}</FormHelperText>
        )}
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Years of Service"
        name="yearsOfService"
        type="number"
        value={formData.yearsOfService || ''}
        onChange={handleChange}
        inputProps={{
          min: 0,
          max: 50,
          step: 0.5
        }}
        error={!!errors.yearsOfService}
        helperText={errors.yearsOfService || ' '}
      />

      <FormControl 
        fullWidth 
        margin="normal"
        error={!!errors.specializations}
      >
        <InputLabel>Specializations (Select up to 3)</InputLabel>
        <Select
          multiple
          name="specializations"
          value={formData.specializations || []}
          onChange={(e) => {
            // Limit to 3 selections
            if (e.target.value.length <= 3) {
              handleChange(e);
            }
          }}
          input={<OutlinedInput label="Specializations (Select up to 3)" />}
          renderValue={(selected) => (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </div>
          )}
        >
          {[
            'Infantry', 'Artillery', 'Armor', 'Engineering', 'Signal/Communications', 
            'Intelligence', 'Military Police', 'Medical', 'Aviation', 'Logistics'
          ].map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </Select>
        {errors.specializations && (
          <FormHelperText error>{errors.specializations}</FormHelperText>
        )}
      </FormControl>
    </>
  );
};

MilitaryMemberForm.propTypes = {
  formData: PropTypes.shape({
    militaryBranch: PropTypes.string,
    rank: PropTypes.string,
    militaryBaseId: PropTypes.string,
    yearsOfService: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    specializations: PropTypes.arrayOf(PropTypes.string),
    assignedChampion: PropTypes.string,
    assignedChampionEmail: PropTypes.string
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  militaryBranches: PropTypes.arrayOf(PropTypes.string),
  allRanks: PropTypes.arrayOf(PropTypes.string),
  militaryBases: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    region: PropTypes.string
  })),
  basesLoading: PropTypes.bool,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func.isRequired,
  handleBaseSelect: PropTypes.func.isRequired,
  errors: PropTypes.object
};

MilitaryMemberForm.defaultProps = {
  militaryBranches: [],
  allRanks: [],
  militaryBases: [],
  basesLoading: false,
  searchTerm: '',
  errors: {}
};

export default MilitaryMemberForm;
