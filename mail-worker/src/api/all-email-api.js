import app from '../hono/hono';
import emailService from '../service/email-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/allEmail/list', async (c) => {
	const data = await emailService.allList(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(data));
})

app.get('/allEmail/assignUsers', async (c) => {
	const data = await emailService.assignUserList(c, c.req.query());
	return c.json(result.ok(data));
})

app.post('/allEmail/assign', async (c) => {
	await emailService.assign(c, await c.req.json(), userContext.getUserId(c));
	return c.json(result.ok());
})

app.post('/allEmail/setGroup', async (c) => {
	await emailService.setGroup(c, await c.req.json());
	return c.json(result.ok())
})

app.get('/allEmail/myList', async (c) => {
	const data = await emailService.myList(c, c.req.query(), userContext.getUserId(c));
	return c.json(result.ok(data));
})

app.delete('/allEmail/delete', async (c) => {
	const list = await emailService.physicsDelete(c, c.req.query());
	return c.json(result.ok(list));
})

app.delete('/allEmail/batchDelete', async (c) => {
	await emailService.batchDelete(c, c.req.query());
	return c.json(result.ok());
})

app.get('/allEmail/latest', async (c) => {
	const list = await emailService.allEmailLatest(c, c.req.query());
	return c.json(result.ok(list));
})
