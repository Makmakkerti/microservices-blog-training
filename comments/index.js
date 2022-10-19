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
	const newComment = { id: commentId, content };
	commentsByPostId[postId] = commentsByPostId[postId]
		? [...commentsByPostId[postId], newComment]
		: [newComment];

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			content,
			postId,
		},
	});

	res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', (req, res) => {
	console.log('Event', req.body.type);
	res.json({});
});

app.listen(4001, () => {
	console.log('[Comments app]: Listening on 4001');
});
