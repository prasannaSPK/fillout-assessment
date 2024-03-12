const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Fillout.com API endpoint
const FILLOUT_API_URL = 'https://api.fillout.com/v1/api/forms';

// Fillout.com API key
const FILLOUT_API_KEY = 'sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912';

// Function to apply filters to form responses
const applyFilters = (responses, filters) => {
  return responses.filter(response => {
    return filters.every(filter => {
      if (response.id === filter.id) {
        switch (filter.condition) {
          case 'equals':
            if (response.type === 'MultipleChoice') {
              return response.options.some(option => option.value === filter.value);
            } else {
              return response.name === filter.value;
            }
          case 'does_not_equal':
            if (response.type === 'MultipleChoice') {
              return !response.options.some(option => option.value === filter.value);
            } else {
              return response.name !== filter.value;
            }
          default:
            return false;
        }
      }
      return true;
    });
  });
};

// Endpoint to fetch form responses with optional filtering
app.get('/:formId/filteredResponses', async (req, res) => {
  try {
    const { formId } = req.params;
    const { page, pageSize, filters } = req.query;

    // Validate formId
    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    // Prepare request to Fillout.com API
    const response = await axios.get(`${FILLOUT_API_URL}/${formId}`, {
      headers: { Authorization: `Bearer ${FILLOUT_API_KEY}` },
      params: { page, pageSize }
    });

    console.log('final response', response.data.questions);

    // Apply filters to form responses
    let filteredResponses = response.data.questions;
    if (filters) {
      const parsedFilters = JSON.parse(decodeURIComponent(filters));
      filteredResponses = applyFilters(filteredResponses, parsedFilters);
    }

    // Send the filtered responses
    res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: Math.ceil(filteredResponses.length / (pageSize || filteredResponses.length))
    });
  } catch (error) {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ error: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: 'Failed to fetch form responses' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});