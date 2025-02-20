// middleware.js

export function middleware(req) {
	const allowedOrigins = [
		"https://ainfo.blog",
		"http://localhost:3000",
		"http://localhost:5173",
	];

	const origin = req.headers.get("origin");

	if (allowedOrigins.includes(origin)) {
		return new Response(null, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		});
	}

	return new Response(null, { status: 200 });
}
