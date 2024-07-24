import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, Grid, Box } from '@mui/material';

const generateInitialState = (rows, cols) => {
  const state = {};
  for (let r = 1; r <= rows; r++) {
    state[r] = {};
    for (let c = 1; c <= cols; c++) {
      state[r][c] = false;
    }
  }
  return state;
};

const DateAndTimePicker = ({ days, setSlotData }) => {
  const rows = days;
  const cols = 13;
  const [checked, setChecked] = useState(generateInitialState(rows, cols));

  useEffect(() => {
    setChecked(generateInitialState(rows, cols));
  }, [days]);

  const handleDataChange = () => {
    console.log(checked);
    setSlotData(checked);
  };

  const handleChange = (row, col) => {
    setChecked((prevChecked) => {
      const newChecked = { ...prevChecked };
      newChecked[row][col] = !newChecked[row][col];
      handleDataChange();
      return newChecked;
    });
  };

  const handleRowChange = (row) => {
    setChecked((prevChecked) => {
      const newChecked = { ...prevChecked };
      if (newChecked[row]) {
        const allChecked = Object.values(newChecked[row]).every(val => val);
        Object.keys(newChecked[row]).forEach(col => newChecked[row][col] = !allChecked);
      }
      handleDataChange();
      return newChecked;
    });
  };

  const handleColumnChange = (col) => {
    setChecked((prevChecked) => {
      const newChecked = { ...prevChecked };
      const allChecked = Object.keys(newChecked).every(row => newChecked[row][col]);
      Object.keys(newChecked).forEach(row => newChecked[row][col] = !allChecked);
      handleDataChange();
      return newChecked;
    });
  };

  const handleTimeChange = (index) => {
    const timeSlots = ['8 - 9', '9 - 10', '10 - 11', '11 - 12', '12 - 13', '13 - 14', '14 - 15', '15 - 16', '16 - 17', '17 - 18', '18 - 19', '19 - 20', '20 - 21'];
    return timeSlots[index - 1];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid item xs={1}></Grid>
        {Array.from({ length: cols }, (_, i) => i + 1).map(col => (
          <Grid item xs={0.8} key={`col-header-${col}`} sx={{ textAlign: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Object.keys(checked).every(row => checked[row] && checked[row][col])}
                  onChange={() => handleColumnChange(col)}
                  sx={{ p: 1, color: 'primary.main' }}
                />
              }
              label={handleTimeChange(col)}
              labelPlacement="start"
              sx={{ m: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            />
          </Grid>
        ))}
      </Grid>
      {Array.from({ length: rows }, (_, i) => i + 1).map(row => (
        <Grid container spacing={1} key={`row-${row}`} sx={{ alignItems: 'center' }}>
          <Grid item xs={1} sx={{ textAlign: 'right' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked[row] && Object.values(checked[row]).every(val => val)}
                  onChange={() => handleRowChange(row)}
                  sx={{ p: 1, color: 'primary.main' }}
                />
              }
              label={`${row}`}
              labelPlacement="end"
              sx={{ m: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
            />
          </Grid>
          {Array.from({ length: cols }, (_, i) => i + 1).map(col => (
            <Grid item xs={0.8} key={`cell-${row}-${col}`} sx={{ textAlign: 'center' }}>
              <Checkbox
                checked={checked[row] ? checked[row][col] : false}
                onChange={() => handleChange(row, col)}
                sx={{ p: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default DateAndTimePicker;