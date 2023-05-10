<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import TodoComp from '$lib/components/TodoComp.svelte';
	import { onMount } from 'svelte';
	import type { Todo } from '@prisma/client';

	// Logic
	export let form;
	export let data;
	let filter = 'all';
	$: ({ todos } = data);

	type FilterType = 'all' | 'completed' | 'uncompleted';

	function filterTodos(todos: Todo[], filter: FilterType): Todo[] {
		switch (filter) {
			case 'completed':
				return todos.filter((todo) => todo.completed);
			case 'uncompleted':
				return todos.filter((todo) => !todo.completed);
			default:
				return todos;
		}
	}

	function handleFilterChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		filter = target.value;
	}

	onMount(() => {
		const select = document.getElementById('filter') as HTMLSelectElement;
		select.addEventListener('change', handleFilterChange);
	});
</script>

<div class="container mx-auto p-10">
	<main class="flex flex-col justify-center gap-6">
		<div class="flex justify-between items-center">
			<h1 class="unstyled text-5xl">
				Hi <span class=" text-primary-700"> {$page.data.user.email}!</span>
			</h1>
			<div>
				<select class="select mt-2" id="filter">
					<option value="all">All</option>
					<option value="completed">Completed</option>
					<option value="uncompleted">Uncompleted</option>
				</select>
			</div>
		</div>
		<div class=" drop-shadow-lg">
			<form action="?/createTodo" method="POST" class="flex items-center" use:enhance>
				<input type="text" name="desc" class="input" placeholder="Enter some text..." />
				<button class="btn variant-filled-primary">Add Todo</button>
			</form>
			{#if form?.required}
				<span><p class="ml-3 text-error-400 text-sm">Todo field must not be empty</p></span>
			{/if}
		</div>
		<div class="flex flex-col gap-3">
			{#if filter === 'all' && todos.length === 0}
				<div class="text-center">
					<h3 class="text-gray-500">You don't have any tasks yet.</h3>
				</div>
			{:else if filter === 'completed' && todos.filter((todo) => todo.completed).length === 0}
				<div class="text-center">
					<h3 class="text-gray-500">You don't have any completed tasks yet.</h3>
				</div>
			{:else if filter === 'uncompleted' && todos.filter((todo) => !todo.completed).length === 0}
				<div class="text-center">
					<h3 class="text-gray-500">You don't have any uncompleted tasks yet.</h3>
				</div>
			{/if}
			{#each filterTodos(todos, filter) as todo}
				<TodoComp {todo} />
			{/each}
		</div>
	</main>
</div>
