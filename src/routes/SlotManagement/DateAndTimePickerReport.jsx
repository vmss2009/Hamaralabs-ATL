import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, Grid, Box, Typography } from '@mui/material';

const generateInitialState = (initialData) => {
  const state = {};
  Object.entries(initialData).forEach(([rowIndex, rowData]) => {
    state[rowIndex] = {};
    Object.entries(rowData).forEach(([colIndex, value]) => {
      state[rowIndex][colIndex] = {
        checked: false,
        enabled: Array.isArray(value),
        value: value,
      };
    });
  });
  return state;
};

const getTimeSlots = (startHour, endHour) => {
  const slots = [];
  for (let i = startHour; i < endHour; i++) {
    slots.push(`${i}:00 - ${i + 1}:00`);
  }
  return slots;
};

const DateAndTimePicker = ({ initialData, setSlotBookings }) => {
  const timeSlots = getTimeSlots(8, 18); // From 8:00 to 18:00
  const datesInMonth = Object.keys(initialData).map((key) => `Day ${key}`);

  const [checked, setChecked] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setChecked(generateInitialState(initialData));
    }
  }, [initialData]);

  const handleChange = (rowIndex, colIndex) => {
    const newChecked = { ...checked };
    newChecked[rowIndex][colIndex].checked = !newChecked[rowIndex][colIndex].checked;
    setChecked(newChecked);

    const selectedArrays = [];
    Object.keys(newChecked).forEach((rIndex) => {
      Object.keys(newChecked[rIndex]).forEach((cIndex) => {
        if (newChecked[rIndex][cIndex].checked && Array.isArray(newChecked[rIndex][cIndex].value) && newChecked[rIndex][cIndex].value.length > 0) {
          for (let i = 0; i < newChecked[rIndex][cIndex].value.length; i++) {
            selectedArrays.push({
              day: `Day ${rIndex}`,
              timePeriod: timeSlots[cIndex - 1], // Adjust the time slot index
              value: newChecked[rIndex][cIndex].value[i],
            });
          }
        }
      });
    });
    setSlotBookings(selectedArrays);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Time Slots
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Typography>Date</Typography>
        </Grid>
        {timeSlots.map((slot, index) => (
          <Grid item xs={1} key={index}>
            <Typography>{slot}</Typography>
          </Grid>
        ))}
      </Grid>
      {Object.keys(initialData).map((dateKey) => {
        const rowIndex = parseInt(dateKey, 10);
        return (
          <Grid container spacing={1} key={rowIndex} sx={{ alignItems: 'center' }}>
            <Grid item xs={2}>
              <Typography>{`Day ${dateKey}`}</Typography>
            </Grid>
            {timeSlots.map((slot, colIndex) => (
              <Grid item xs={1} key={colIndex}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked[rowIndex] && checked[rowIndex][colIndex + 1] ? checked[rowIndex][colIndex + 1].checked : false}
                      onChange={() => handleChange(rowIndex, colIndex + 1)}
                      disabled={
                        !(checked[rowIndex] && checked[rowIndex][colIndex + 1] && checked[rowIndex][colIndex + 1].enabled)
                      }
                    />
                  }
                  label={checked[rowIndex] && checked[rowIndex][colIndex + 1] && checked[rowIndex][colIndex + 1].enabled
                    ? `${checked[rowIndex][colIndex + 1].value.length}`
                    : ''}
                />
              </Grid>
            ))}
          </Grid>
        );
      })}
    </Box>
  );
};

export default DateAndTimePicker;