const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Fillout.com API endpoint
const FILLOUT_API_URL = 'https://api.fillout.com';

// Fillout.com API key
const FILLOUT_API_KEY = 'sk_prod_TfMbARhdgues5AuIosvvdAC9WsA5kXiZlW8HZPaRDlIbCpSpLsXBeZO7dCVZQwHAY3P4VSBPiiC33poZ1tdUj2ljOzdTCCOSpUZ_3912';

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
        const response = await axios.get(`${FILLOUT_API_URL}/forms/${formId}/responses`, {
            headers: {
                Authorization: `Bearer ${FILLOUT_API_KEY}`
            },
            params: {
                page,
                pageSize,
                filters: filters ? JSON.parse(filters) : undefined
            }
        });

        // Send the response from Fillout.com API
        res.json(response.data);
    } catch (error) {
        // Handle errors
        console.error('Error fetching form responses:', error);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch form responses' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
