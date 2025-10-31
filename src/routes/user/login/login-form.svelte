<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator
	} from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	import { m } from '$lib/paraglide/messages.js';
	import GoogleSvg from '$lib/assets/google.svg?raw';
	import AppleSvg from '$lib/assets/apple.svg?raw';

	let { form }: { form: ActionData } = $props();

	const idform = 'login';
</script>

<div class={cn('flex flex-col gap-6')}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">{m.welcomeBack()}</Card.Title>
			<Card.Description>{m.loginWithSocial()}</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" action="?/login" use:enhance>
				<FieldGroup>
					<Field class="text-center">
						<!--						<Button variant="outline" type="button">-->
						<!--							{@html AppleSvg}-->
						<!--							{m.loginWithApple()}-->
						<!--						</Button>-->
						<Button variant="outline" type="button" onclick={() => goto('login/google')}>
							{@html GoogleSvg}
							{m.loginWithGoogle()}
						</Button>
					</Field>
					<FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
						{m.orContinueWith()}
					</FieldSeparator>
					<Field>
						<FieldLabel for="email-{idform}">{m.email()}</FieldLabel>
						<Input
							name="username"
							id="email-{idform}"
							type="text"
							placeholder="name@example.com"
							required
						/>
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{idform}">{m.password()}</FieldLabel>
							<a href="##" class="ml-auto text-sm underline-offset-4 hover:underline">
								{m.forgotPassword()}
							</a>
						</div>
						<Input name="password" id="password-{idform}" type="password" required />
					</Field>
					<Field>
						<Button type="submit">{m.login()}</Button>
						<FieldDescription class="text-center">
							{m.dontHaveAccount()}
							<button class="hover:underline" formaction="?/register">{m.register()}</button>
							<!-- class="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"-->
							<!-- <a href="##">Sign up</a>-->
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		<span style="color: red">{form?.message ?? ''}</span>
		<!-- TODO colocar de outra forma, uma variavel ou ate mesmo um link para /docs. Pensar direito sobre isso para os clientes -->
		{m.termsOfService()}
		<a href="/license.pdf" target="_blank">{m.termsOfServiceLink()} e {m.privacyPolicy()}</a>.
	</FieldDescription>
</div>
