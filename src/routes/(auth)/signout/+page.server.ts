import { redirect } from '@sveltejs/kit';

export async function load() {
	throw redirect(302, '/');
}

export const actions = {
	signout: async ({ cookies }) => {
		cookies.set('todo-session', '', {
			path: '/',
			expires: new Date(0)
		});

		throw redirect(302, '/login');
	}
};
