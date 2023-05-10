import prisma from '$lib/server/prisma.js';
import type { Todo } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, setHeaders }) {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email: locals.user.email },
			select: { id: true }
		});

		const getTodos = async () => {
			const todos: Todo[] = await prisma.todo.findMany({
				where: { userId: String(user?.id) }
			});

			return todos;
		};

		setHeaders({
			'Cache-Control': `max-age=0, s-maxage=${60 * 60}`
		});

		return {
			todos: getTodos()
		};
	} catch (error) {
		return fail(400, { failed: true });
	}
}

export const actions = {
	createTodo: async ({ request, locals }) => {
		const { desc } = Object.fromEntries(await request.formData()) as { desc: string };

		if (desc === '') {
			return fail(400, { required: true });
		}

		const userId = await prisma.user.findUnique({
			where: { email: locals.user.email },
			select: { id: true }
		});

		try {
			await prisma.todo.create({
				data: {
					desc,
					user: {
						connect: { id: userId?.id }
					}
				}
			});
		} catch (error) {
			console.log(error);
			return fail(400, { failed: true });
		}
	},
	deleteTodo: async ({ url }) => {
		const todoId = url.searchParams.get('todoId');

		try {
			await prisma.todo.delete({
				where: { id: String(todoId) }
			});
		} catch (error) {
			return fail(400, { failed: true });
		}
	},
	updateTodo: async ({ url }) => {
		const todoId = url.searchParams.get('todoId');

		try {
			const completedTodo = await prisma.todo.findUnique({
				where: { id: String(todoId) },
				select: { completed: true }
			});

			await prisma.todo.update({
				where: { id: String(todoId) },
				data: { completed: !completedTodo?.completed }
			});
		} catch (error) {
			return fail(400, { failed: true });
		}
	}
};
