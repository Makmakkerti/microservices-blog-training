const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.json(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
	const id = req.params.id;
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;
	const newComment = { id: commentId, content };
	commentsByPostId[id] = commentsByPostId[id]
		? [...commentsByPostId[id], newComment]
		: [newComment];

	res.status(201).send(commentsByPostId[id]);
});

app.listen(4001, () => {
	console.log('[Comments app]: Listening on 4001');
});
