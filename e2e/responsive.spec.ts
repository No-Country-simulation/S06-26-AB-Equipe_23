import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const email = process.env.APPBIT_TEST_EMAIL;
const password = process.env.APPBIT_TEST_PASSWORD;

if (!email || !password) {
  throw new Error('APPBIT_TEST_EMAIL e APPBIT_TEST_PASSWORD devem estar definidos na sessao local.');
}

const viewports = [
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1366x768', width: 1366, height: 768 },
] as const;

const routes = [
  { file: '04-shortlist.png', route: '/shortlist', ready: 'Lista de triagem' },
  { file: '05-insights.png', route: '/insights/regioes', ready: 'Insights Regionais' },
  { file: '06-relatorio-esg.png', route: '/relatorio-esg', ready: 'Relatório ESG' },
  { file: '07-saude-time.png', route: '/saude-time', ready: 'Saúde do Time' },
  { file: '08-formacoes.png', route: '/trilhas-capacitacoes', ready: 'Trilhas de Capacitação' },
  { file: '09-eventos.png', route: '/eventos', ready: 'Eventos Corporativos de Diversidade' },
  { file: '10-mentorias.png', route: '/mentorias', ready: 'Conexão com Líderes de Diversidade' },
] as const;

type RouteResult = {
  viewport: string;
  route: string;
  result: 'APROVADO' | 'REPROVADO';
  overflow: boolean;
  consoleErrors: number;
  failedRequests: number;
  evidence: string;
};

const results: RouteResult[] = [];
const resultFile = path.resolve('docs/validacao/responsividade/results.json');

function evidencePath(viewport: string, file: string) {
  return path.resolve('docs/validacao/responsividade', viewport, file);
}

async function capture(
  page: Page,
  viewport: string,
  route: string,
  file: string,
  consoleErrors: string[],
  failedRequests: string[],
) {
  const output = evidencePath(viewport, file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await page.screenshot({ path: output, fullPage: true });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );

  results.push({
    viewport,
    route,
    result: overflow || consoleErrors.length > 0 || failedRequests.length > 0 ? 'REPROVADO' : 'APROVADO',
    overflow,
    consoleErrors: consoleErrors.length,
    failedRequests: failedRequests.length,
    evidence: path.relative(process.cwd(), output).replace(/\\/g, '/'),
  });

  expect(overflow, `Overflow horizontal em ${viewport} ${route}`).toBe(false);
  expect(consoleErrors, `Erros de console em ${viewport} ${route}`).toEqual([]);
  expect(failedRequests, `Falhas de requisicao em ${viewport} ${route}`).toEqual([]);
}

test.afterAll(() => {
  fs.mkdirSync(path.dirname(resultFile), { recursive: true });
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
});

for (const viewport of viewports) {
  test(`${viewport.name}: fluxo responsivo autenticado`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    let consoleErrors: string[] = [];
    let failedRequests: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.method()} ${request.url()}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible();
    await capture(page, viewport.name, '/login', '01-login.png', consoleErrors, failedRequests);

    consoleErrors = [];
    failedRequests = [];
    await page.getByLabel('E-mail').fill(email);
    await page.getByLabel('Senha').fill(password);
    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().endsWith('/login') && response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(200);
    await expect.poll(() => page.evaluate(() => Boolean(localStorage.getItem('token')))).toBe(true);
    await expect(page).toHaveURL(/\/vagas$/);
    await expect(page.getByText('Vagas publicadas')).toBeVisible();
    await capture(page, viewport.name, '/vagas', '02-vagas.png', consoleErrors, failedRequests);

    consoleErrors = [];
    failedRequests = [];
    await page.getByText('Engenheira de Dados Sênior').first().click();
    await expect(page.getByRole('button', { name: /Ver shortlist de candidatos/ })).toBeVisible();
    await capture(page, viewport.name, '/vagas#detalhe', '03-vaga-detalhe.png', consoleErrors, failedRequests);

    for (const item of routes) {
      consoleErrors = [];
      failedRequests = [];
      await page.goto(item.route);
      await expect(page.getByText(item.ready, { exact: false }).first()).toBeVisible();
      if (item.route === '/shortlist') {
        await expect(page.locator('.sl-card').first()).toBeVisible();
      }
      await page.waitForTimeout(300);
      await capture(page, viewport.name, item.route, item.file, consoleErrors, failedRequests);
    }

    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto('/vagas');
    await expect(page).toHaveURL(/\/login$/);
  });
}
