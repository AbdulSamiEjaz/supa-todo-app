import prisma from '$lib/server/prisma';

export async function handle({ resolve, event }) {
	const session = event.cookies.get('todo-session');

	if (!session) {
		return resolve(event);
	}

	const user = await prisma.user.findUnique({
		where: { userAuthToken: session },
		select: { email: true }
	});

	if (user) {
		event.locals.user = {
			email: user.email
		};
	}

	return await resolve(event);
}
