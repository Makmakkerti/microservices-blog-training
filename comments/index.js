const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.json(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const postId = req.params.id;
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;
	const newComment = { id: commentId, content, status: 'pending' };
	commentsByPostId[postId] = commentsByPostId[postId]
		? [...commentsByPostId[postId], newComment]
		: [newComment];

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			content,
			postId,
			status: 'pending',
		},
	});

	res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', async (req, res) => {
	console.log('Event', req.body.type);

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { postId, id, status, content } = data;
		comments = commentsByPostId[postId];

		const comment = comments.find((comment) => comment.id === id);
		comment.status = status;

		await axios.post('http://localhost:4005/events', {
			type: 'CommentUpdated',
			data: { postId, id, status, content },
		});
	}
	res.json({});
});

app.listen(4001, () => {
	console.log('[Comments app]: Listening on 4001');
});
