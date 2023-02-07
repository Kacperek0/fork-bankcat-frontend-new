import { test, expect } from '@playwright/test'

test('Homepage', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/')
  await expect(page.locator('.logo').locator('text=Bankcat')).toBeVisible()

  await expect(page.locator('.v-card__title')).toContainText('Witamy')
  await expect(page.locator('.v-card__text')).toContainText('Rejestracja')
  await expect(page.locator('.v-card__text')).toContainText('Logowanie')
})

test('Sign in', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/auth/login')
  await expect(page.locator('.v-card__title')).toContainText('Logowanie')
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('input[name="password"]')).toBeVisible()
  await expect(page.locator('button[type="submit"]')).toContainText('Zaloguj się')
})

test('Sign up', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/auth/register')
  await expect(page.locator('.v-card__title')).toContainText('Rejestracja')
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('input[name="name"]')).toBeVisible()
  await expect(page.locator('input[name="surname"]')).toBeVisible()
  await expect(page.locator('input[name="hashed_password"]')).toBeVisible()
  await expect(page.locator('input[name="password_confirmation"]')).toBeVisible()
  await expect(page.locator('button[type="submit"]')).toContainText('Zarejestruj się')
})

