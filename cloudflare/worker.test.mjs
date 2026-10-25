import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';

function assetEnvironment() {
  const requests = [];
  return { requests, ASSETS: { async fetch(request) {
    const url = new URL(request.url);
    requests.push(url);
    const exists = ['/', '/index.html', '/menu.html', '/contact.html', '/robots.txt', '/sitemap.xml'].includes(url.pathname);
    return new Response(exists ? 'asset' : 'not found', { status: exists ? 200 : 404 });
  } } };
}

test('redirects production host, protocol and index path together, preserving queries', async () => {
  for (const source of ['http://www.mamarosabar.ca/index.html?ref=menu', 'https://www.mamarosabar.ca/index.html?ref=menu', 'http://mamarosabar.ca/index.html?ref=menu']) {
    const response = await worker.fetch(new Request(source), assetEnvironment());
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), 'https://mamarosabar.ca/?ref=menu');
  }
});

test('redirects www and HTTP on inner pages without dropping paths', async () => {
  const response = await worker.fetch(new Request('http://www.mamarosabar.ca/menu.html?q=pizza'), assetEnvironment());
  assert.equal(response.headers.get('Location'), 'https://mamarosabar.ca/menu.html?q=pizza');
});

test('maps root to homepage internally and preserves direct HTML and discovery URLs', async () => {
  for (const path of ['/', '/menu.html', '/contact.html', '/robots.txt', '/sitemap.xml']) {
    const env = assetEnvironment();
    const response = await worker.fetch(new Request('https://mamarosabar.ca' + path), env);
    assert.equal(response.status, 200);
    assert.equal(env.requests[0].pathname, path === '/' ? '/index.html' : path);
  }
});

test('keeps preview hostname usable and does not replace unknown paths with homepage', async () => {
  const env = assetEnvironment();
  const response = await worker.fetch(new Request('https://mamarosabarv2.example.workers.dev/missing'), env);
  assert.equal(response.status, 404);
  assert.equal(env.requests[0].pathname, '/missing');
});
