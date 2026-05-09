export const json = (res, statusCode, payload) => {
	res.writeHead(statusCode, {
		'Content-Type': 'application/json',
	});
	res.end(JSON.stringify(payload));
};

export const noContent = (res) => {
	res.writeHead(204);
	res.end();
};

export const notFound = (res, path) => {
	json(res, 404, {
		error: `Mock route not found: ${path}`,
	});
};

export const applyCorsHeaders = (res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,POST,PUT,PATCH,DELETE,OPTIONS',
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type,Authorization',
	);
};

export const readBody = async (req) => {
	const chunks = [];
	for await (const chunk of req) {
		chunks.push(chunk);
	}

	if (!chunks.length) return undefined;

	const raw = Buffer.concat(chunks).toString('utf8');
	if (!raw.trim()) return undefined;

	try {
		return JSON.parse(raw);
	} catch {
		return undefined;
	}
};

export const normalizePath = (pathname) => {
	let normalized = pathname;
	while (normalized.startsWith('/api/api/')) {
		normalized = normalized.replace('/api/api/', '/api/');
	}
	return normalized;
};
