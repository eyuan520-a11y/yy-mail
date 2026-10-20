import app from '../hono/hono';
import result from '../model/result';
import groupService from '../service/group-service';

app.get('/group/list', async (c) => {
	const list = await groupService.list(c, c.req.query());
	return c.json(result.ok(list));
})

app.post('/group/add', async (c) => {
	await groupService.add(c, await c.req.json());
	return c.json(result.ok());
})

app.post('/group/update', async (c) => {
	await groupService.update(c, await c.req.json());
	return c.json(result.ok());
})

app.post('/group/delete', async (c) => {
	await groupService.delete(c, await c.req.json());
	return c.json(result.ok());
})
