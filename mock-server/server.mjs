import { createServer } from 'node:http';
import { URL } from 'node:url';
import {
	applyCorsHeaders,
	noContent,
	notFound,
	normalizePath,
	readBody,
} from './lib/http.mjs';
import { createState } from './lib/state.mjs';
import { handleRoute } from './routes/index.mjs';

const PORT = Number(process.env.MOCK_SERVER_PORT ?? 3100);
const state = createState();

const server = createServer(async (req, res) => {
	applyCorsHeaders(res);

	if (req.method === 'OPTIONS') {
		noContent(res);
		return;
	}

	const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
	const pathname = normalizePath(url.pathname);
	const method = req.method ?? 'GET';
	const body = await readBody(req);

	const handled = handleRoute({
		req,
		res,
		method,
		pathname,
		url,
		body,
		state,
	});

	if (!handled) {
		notFound(res, pathname);
	}
});

server.listen(PORT, () => {
	console.log(`Mock server is running on http://localhost:${PORT}`);
});
