#!/usr/bin/env node
/**
 * Fetches direct image URLs for product rows in a CSV file.
 *
 * - Primary engine: SerpApi Google Images (SERPAPI_API_KEY required).
 * - Fallback: Bing Image Search (BING_IMAGE_SEARCH_KEY required).
 *
 * Usage:
 *   node scripts/imageFetcher.mjs [input.csv] [output.json]
 *
 * Environment:
 *   SERPAPI_API_KEY       Optional; enables SerpApi.
 *   BING_IMAGE_SEARCH_KEY Optional; enables Bing Image Search fallback.
 *   IMAGE_PROVIDER        Optional; comma list to force provider order (serpapi,bing).
 *   IMAGE_LIMIT           Optional; number of image URLs to collect per product (default 3).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISALLOWED_HOSTS = ['amazon.', 'ebay.', 'aliexpress.', 'alibaba.', 'walmart.'];
const DEFAULT_LIMIT = Number.parseInt(process.env.IMAGE_LIMIT ?? '3', 10) || 3;
const providerPreference = (process.env.IMAGE_PROVIDER ?? '').split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);

const serpApiKey = process.env.SERPAPI_API_KEY;
const bingApiKey = process.env.BING_IMAGE_SEARCH_KEY;

function logInfo(message) {
  process.stdout.write(`INFO: ${message}\n`);
}

function logWarn(message) {
  process.stderr.write(`WARN: ${message}\n`);
}

function readCsv(filePath) {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const raw = fs.readFileSync(resolvedPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('CSV file is empty.');
  }

  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? '';
    });
    return row;
  });
}

function isAllowed(url) {
  return !DISALLOWED_HOSTS.some((block) => url.toLowerCase().includes(block));
}

function dedupe(urls) {
  const seen = new Set();
  return urls.filter((url) => {
    const normalized = url.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

async function fetchFromSerpApi(query, limit) {
  if (!serpApiKey) return [];
  const params = new URLSearchParams({ q: query, engine: 'google_images', api_key: serpApiKey, ijn: '0' });
  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  if (!response.ok) {
    logWarn(`SerpApi request failed (${response.status}): ${await response.text()}`);
    return [];
  }
  const data = await response.json();
  const urls = (data.image_results ?? [])
    .map((item) => item.original)
    .filter(Boolean)
    .filter(isAllowed);
  return dedupe(urls).slice(0, limit);
}

async function fetchFromBing(query, limit) {
  if (!bingApiKey) return [];
  const params = new URLSearchParams({ q: query, count: String(limit * 2), safeSearch: 'Off' });
  const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?${params.toString()}`, {
    headers: { 'Ocp-Apim-Subscription-Key': bingApiKey },
  });
  if (!response.ok) {
    logWarn(`Bing request failed (${response.status}): ${await response.text()}`);
    return [];
  }
  const data = await response.json();
  const urls = (data.value ?? [])
    .map((item) => item.contentUrl)
    .filter(Boolean)
    .filter(isAllowed);
  return dedupe(urls).slice(0, limit);
}

const PROVIDERS = {
  serpapi: fetchFromSerpApi,
  bing: fetchFromBing,
};

async function searchImages(query, limit) {
  const order = providerPreference.length > 0 ? providerPreference : Object.keys(PROVIDERS);
  const results = [];
  for (const providerKey of order) {
    const provider = PROVIDERS[providerKey];
    if (!provider) continue;
    const urls = await provider(query, limit);
    if (urls.length > 0) {
      results.push(...urls);
    }
    if (results.length >= limit) break;
  }
  return dedupe(results).slice(0, limit);
}

function buildQuery(row) {
  const parts = [row.search_name_en || row.search_description_en || row.sku];
  if (row.brand_effective) parts.unshift(row.brand_effective);
  if (row.category_id) parts.push(row.category_id);
  return parts.filter(Boolean).join(' ').trim();
}

async function main() {
  const inputPath = process.argv[2] ?? path.join(__dirname, 'sample_products.csv');
  const outputPath = process.argv[3] ?? path.join(__dirname, 'image_urls.json');
  const limit = DEFAULT_LIMIT;

  if (!serpApiKey && !bingApiKey) {
    logWarn('No API key configured. Set SERPAPI_API_KEY or BING_IMAGE_SEARCH_KEY for best results.');
  }

  const rows = readCsv(inputPath);
  logInfo(`Loaded ${rows.length} products from ${inputPath}`);

  const output = [];
  for (const row of rows) {
    const query = buildQuery(row);
    logInfo(`Searching: "${query}"`);
    const images = await searchImages(query, limit);
    if (images.length < limit) {
      logWarn(`Only found ${images.length} image(s) for ${row.sku}.`);
    }
    output.push({ ...row, images });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  logInfo(`Saved results to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
