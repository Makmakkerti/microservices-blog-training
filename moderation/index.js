const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
	const { type, data } = req.body;
	const { id, postId, content } = data;

	if (type === 'CommentCreated') {
		const status = data.content.includes('lorem') ? 'rejected' : 'approved';

		await axios
			.post('http://localhost:4005/events', {
				type: 'CommentModerated',
				data: {
					id,
					postId,
					content,
					status,
				},
			})
			.catch((e) => console.log(e.message));
	}

	res.send({});
});

app.listen(4003, () => {
	console.log('[Moderation service]: Listening on 4003');
});
