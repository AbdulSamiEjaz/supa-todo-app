<script>
	import { enhance } from '$app/forms';
</script>

<div class="container mx-auto p-10 mt-20">
	<div class="card p-4 w-full flex flex-col gap-6 mx-auto drop-shadow-xl">
		<div class="card-header text-primary-700">
			<h1 class="unstyled text-4xl text-center">Create an account</h1>
		</div>
		<div>
			<form class="flex flex-col gap-4" method="POST" use:enhance>
				<input type="email" name="email" placeholder="Enter your email" class="input" />
				<input type="password" name="password" placeholder="Enter your password" class="input" />

				<p class="hidden text-error-400 text-md ml-4">Invalid credentials</p>

				<button class="btn variant-filled-secondary">Register</button>
			</form>
		</div>
	</div>
</div>
