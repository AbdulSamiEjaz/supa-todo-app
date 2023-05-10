import prisma from '$lib/server/prisma.js';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export async function load({locals}) {
	if (locals.user) {
		throw redirect(302 ,"/")
	}
}

export const actions = {
	default: async ({ request }) => {
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

		if (userExists) {
			return fail(400, { exists: true });
		}

		try {
			await prisma.user.create({
				data: {
					email,
					passwordHash: await bcrypt.hash(password, 10),
					userAuthToken: crypto.randomUUID()
				}
			});
		} catch (error) {
			return fail(400, { failed: true });
		}

		throw redirect(302, '/login');
	}
};
