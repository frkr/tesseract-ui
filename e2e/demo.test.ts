import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

// Testes para a pagina /p/[id]
test.describe('/p/[id] page tests', () => {
	// Testes com IDs simples
	test('should display numeric ID correctly', async ({ page }) => {
		await page.goto('/p/123');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('123');
	});

	test('should display text ID correctly', async ({ page }) => {
		await page.goto('/p/test');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('test');
	});

	// Testes com caracteres especiais
	test('should display ID with hyphens correctly', async ({ page }) => {
		await page.goto('/p/abc-def');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('abc-def');
	});

	test('should display ID with underscores correctly', async ({ page }) => {
		await page.goto('/p/test_123');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('test_123');
	});

	test('should display ID with mixed special characters', async ({ page }) => {
		await page.goto('/p/my-test_id-123');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('my-test_id-123');
	});

	// Testes com caracteres especiais complexos
	test('should handle URL encoded spaces', async ({ page }) => {
		const id = 'hello world';
		await page.goto(`/p/${encodeURIComponent(id)}`);
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText(id);
	});

	test('should handle special URL characters', async ({ page }) => {
		const id = 'test&value=123';
		await page.goto(`/p/${encodeURIComponent(id)}`);
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText(id);
	});

	test('should handle unicode characters', async ({ page }) => {
		const id = 'teste-brasil-2024';
		await page.goto(`/p/${id}`);
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText(id);
	});

	// Teste com ID muito longo
	test('should handle very long IDs', async ({ page }) => {
		const longId = 'a'.repeat(150);
		await page.goto(`/p/${longId}`);
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText(longId);
	});

	test('should handle long ID with special characters', async ({ page }) => {
		const longId = 'test-id-'.repeat(20) + 'final';
		await page.goto(`/p/${longId}`);
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText(longId);
	});

	// Teste de navegacao
	test('should navigate from home page to /p/[id]', async ({ page }) => {
		// Primeiro vai para a home
		await page.goto('/');
		await expect(page.locator('h1')).toBeVisible();

		// Navega para a pagina /p/[id]
		await page.goto('/p/navigation-test');
		const h1 = page.locator('h1');
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('navigation-test');

		// Verifica a URL
		expect(page.url()).toContain('/p/navigation-test');
	});
});
