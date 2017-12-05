const router = require('koa-router')();
const pastes = require('./controllers/pastes');

router
	.get('/', pastes.index)
	.post('/', pastes.create)
	.get('/:id', pastes.view);

module.exports = router;
