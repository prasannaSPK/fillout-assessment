# Fillout API Server

This is a simple REST API server built with Node.js and Express.js to interact with Fillout.com's API to fetch form responses with filtering capabilities.

## Setup

1. Clone this repository to your local machine:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies:

    ```bash
    cd fillout-api
    npm install
    ```

3. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add your Fillout.com API key to the `.env` file:

    ```
    FILLOUT_API_KEY=your_fillout_api_key
    ```

4. Start the server:

    ```bash
    npm start
    ```

The server should now be running on `http://localhost:3000`.

## Usage

### Fetch Form Responses with Filtering

To fetch form responses with filtering, make a GET request to the following endpoint:

