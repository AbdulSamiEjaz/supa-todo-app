<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatTime } from '$lib/utils/utils';
	import type { Todo } from '@prisma/client';
	import Icon from '@iconify/svelte';
	export let todo: Todo;
</script>

<div
	class="card p-2 flex justify-between items-center drop-shadow-lg {todo.completed
		? 'bg-surface-700/10'
		: ''}
"
>
	<div
		class="flex flex-col p-1 {todo.completed ? 'line-through text-surface-500/50' : ''}
	"
	>
		<p class="unstyled text-lg">{todo.desc}</p>
		<span class="unstyled text-sm text-gray-500">{formatTime(todo.createdAt)}</span>
	</div>
	<div class="flex gap-1">
		<form action="/?/updateTodo&todoId={todo.id}" method="POST" use:enhance>
			<button type="submit" class="btn-icon variant-filled"
				><Icon icon="fluent-mdl2:completed" color="green" width="24" height="24" /></button
			>
		</form>
		<form action="/?/deleteTodo&todoId={todo.id}" method="POST" use:enhance>
			<button type="submit" class="btn-icon variant-filled"
				><Icon icon="mdi:trash-can-outline" color="red" width="24" height="24" /></button
			>
		</form>
	</div>
</div>
