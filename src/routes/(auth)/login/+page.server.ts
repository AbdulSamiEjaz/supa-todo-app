import prisma from '$lib/server/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(302, '/');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		if (email === '' || password === '') {
			return fail(400, { required: true });
		}

		const userExists = await prisma.user.findUnique({
			where: { email }
		});

		if (!userExists) {
			return fail(400, { invalid: true });
		}

		const userPassword = await bcrypt.compare(password, userExists?.passwordHash);

		if (!userPassword) {
			return fail(400, { invalid: true });
		}

		try {
			const authenticatedUser = await prisma.user.update({
				where: { email: userExists.email },
				data: { userAuthToken: crypto.randomUUID() }
			});

			cookies.set('todo-session', authenticatedUser.userAuthToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30
			});
		} catch (error) {
			return fail(400, { failed: true });
		}

		throw redirect(302, '/');
	}
};
