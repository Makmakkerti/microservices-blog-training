const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
	res.json(posts);
});

app.post('/events', ({ body }, res) => {
	const { type, data } = body;

	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId } = data;

		const post = posts[postId];
		post.comments.push({ id, content });
	}
});

app.listen(4002, () => {
	console.log('[Query service]: Listening on 4002');
});
