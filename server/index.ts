import type { Request, Response } from 'express';

type PluginContext = {
  router: import('express').Router;
  rbac: { require: (perm: string) => import('express').RequestHandler };
  withTenantTx: <T>(tenantId: string, run: (db: any) => Promise<T>) => Promise<T>;
  log: (msg: string, meta?: object) => void;
};

const MODULE_ID = 'sample';

export const permissions = [
  `${MODULE_ID}.items.read`,
  `${MODULE_ID}.items.create`,
  `${MODULE_ID}.items.update`,
  `${MODULE_ID}.items.delete`,
];

const plugin = {
  meta: { id: MODULE_ID, version: '0.1.0', api: '1.x' },

  async register(ctx: PluginContext) {
    ctx.router.get('/health', (_req: Request, res: Response) => {
      res.json({ ok: true, plugin: MODULE_ID });
    });

    ctx.router.get('/items', ctx.rbac.require(`${MODULE_ID}.items.read`), async (req: any, res: Response) => {
      const rows = await ctx.withTenantTx(req.auth?.tenant_id, async (db) => {
        const r = await db.execute('select id, name, created_at from items order by created_at desc');
        return (r as any).rows ?? r;
      });
      res.json(rows);
    });

    ctx.router.post('/items', ctx.rbac.require(`${MODULE_ID}.items.create`), async (req: any, res: Response) => {
      const { name } = req.body ?? {};
      if (!name || !String(name).trim()) return res.status(400).json({ error: 'NAME_REQUIRED' });
      const row = await ctx.withTenantTx(req.auth?.tenant_id, async (db) => {
        const r = await db.execute('insert into items (name) values ($1) returning id, name, created_at', [name]);
        return ((r as any).rows ?? r)[0];
      });
      res.status(201).json(row);
    });

    ctx.log('registered');
  },
};

export default plugin;