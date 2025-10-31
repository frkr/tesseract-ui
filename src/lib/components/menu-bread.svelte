<script lang="ts">
	import { page } from '$app/stores';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	export type MenuItemLink = {
		title: string;
		href: string;
		description?: string;
	};

	export type MenuItem = {
		trigger: string;
		items: MenuItemLink[];
	};

	export type MenuData = MenuItem[];

	const menu = $derived(($page.data.menu as MenuData | undefined) || []);

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>

{#snippet ListItem({ title, content, href, class: className, ...restProps }: ListItemProps)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
						'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
						className
					)}
					{...restProps}
				>
					<div class="text-sm font-medium leading-none">{title}</div>
					<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

{#if menu.length > 0}
	<NavigationMenu.Root viewport={false}>
		<NavigationMenu.List>
			{#each menu as menuItem}
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>{menuItem.trigger}</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
							{#each menuItem.items as item}
								{@render ListItem({
									href: item.href,
									title: item.title,
									content: item.description || ''
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			{/each}
		</NavigationMenu.List>
	</NavigationMenu.Root>
{/if}
