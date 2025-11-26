import { Request, Response } from 'express';
import { getDb, initDb } from '../db/providers';
import { encryptApiKey, decryptApiKey, hasApiKeyStored } from '../utils/crypto';

export async function getProviders(req: Request, res: Response) {
  const db = await getDb();
  const rows = await db.all('SELECT * FROM ProviderConfig');
  // Only return hasApiKey boolean, never the actual apiKey
  const providers = rows.map((row: any) => ({
    id: row.id,
    providerName: row.providerName,
    providerSlug: row.providerSlug,
    model: row.model,
    getKeyUrl: row.getKeyUrl,
    customConnectorCode: row.customConnectorCode,
    hasApiKey: !!row.apiKey
  }));
  res.json(providers);
}

export async function createProvider(req: Request, res: Response) {
  const db = await getDb();
  const {
    id,
    providerName,
    providerSlug,
    apiKey,
    model,
    getKeyUrl,
    customConnectorCode
  } = req.body;

  let encryptedApiKey = '';
  if (apiKey) {
    encryptedApiKey = encryptApiKey(apiKey);
  }

  await db.run(
    `INSERT INTO ProviderConfig (id, providerName, providerSlug, apiKey, model, getKeyUrl, customConnectorCode)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, providerName, providerSlug, encryptedApiKey, model, getKeyUrl, customConnectorCode]
  );
  res.status(201).json({ success: true });
}

export async function updateProvider(req: Request, res: Response) {
  const db = await getDb();
  const { id } = req.params;
  const {
    providerName,
    providerSlug,
    apiKey,
    model,
    getKeyUrl,
    customConnectorCode
  } = req.body;

  let encryptedApiKey = '';
  if (apiKey) {
    encryptedApiKey = encryptApiKey(apiKey);
  }

  await db.run(
    `UPDATE ProviderConfig SET providerName=?, providerSlug=?, apiKey=?, model=?, getKeyUrl=?, customConnectorCode=?
     WHERE id=?`,
    [providerName, providerSlug, encryptedApiKey, model, getKeyUrl, customConnectorCode, id]
  );
  res.json({ success: true });
}

export async function deleteProvider(req: Request, res: Response) {
  const db = await getDb();
  const { id } = req.params;
  await db.run(`DELETE FROM ProviderConfig WHERE id=?`, [id]);
  res.json({ success: true });
}
