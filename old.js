const express = require('express');
const axios = require('axios');
const { parseString } = require('xml2js');
const app = express();

// The Guardian API key
const API_KEY = 'f98362c3-d776-433d-9513-ff0546b60c2d';

// The Guardian API base URL
const guardianBaseUrl = 'https://content.guardianapis.com';
const newapi = 'https://content.guardianapis.com/sections?q=business&api-key=f98362c3-d776-433d-9513-ff0546b60c2d';

// Define routes for different sections (e.g., /movies, /politics)

app.get("/api/async/:section", async (req, res) => {
	try {

		const response = await axios({
			url: 'https://content.guardianapis.com/sections?${section}&api-key=f98362c3-d776-433d-9513-ff0546b60c2d',
			method: "get",
		});
		res.status(200).json(response.data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});
// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
