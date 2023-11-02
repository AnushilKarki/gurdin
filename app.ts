import express, { Request, Response } from 'express';
import axios from 'axios';
import { parseString } from 'xml2js';

const app = express();
const API_KEY = 'f98362c3-d776-433d-9513-ff0546b60c2d';
const guardianBaseUrl = 'https://content.guardianapis.com';

app.get('/api/:section', async (req: Request, res: Response) => {
  const section = req.params.section;
  const rssUrl = `${guardianBaseUrl}/${section}?format=xml&api-key=${API_KEY}`;


    const response = await axios.get(rssUrl);

    if (response.status !== 200) {
      res.status(response.status).json({ error: 'RSS feed request failed' });
      return;
    }

    parseString(response.data, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing RSS feed' });
      } else {
        res.json(result);
      }
    });
  
});
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
