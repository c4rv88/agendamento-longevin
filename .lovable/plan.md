

## Plano: Trocar POST tunnel por chamadas diretas no proxy

### Problema atual
O `feegowFetch` envia **tudo como POST** para `/api/feegow`, com `{ endpoint, method, body }` no body. O proxy Express em `server/index.js` desempacota e re-envia para a Feegow. Isso é um "tunnel" desnecessário.

### Solução
Chamadas diretas: `fetch('/api/feegow/v1' + path, { method })`. O proxy Express vira um passthrough transparente para qualquer rota sob `/api/feegow/v1/*`.

### Mudanças

#### 1. `src/services/api/apiConfig.ts`
Trocar o `feegowFetch` de POST tunnel para chamada direta:

```typescript
export const feegowFetch = async (endpoint: string, method: string = "GET", body?: any): Promise<any> => {
  const url = `/api/feegow/v1${endpoint}`;
  console.log(`feegowFetch: ${method} ${url}`, body);

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  // ... error handling igual
};
```

Nenhum serviço consumidor muda — todos já passam `endpoint` como `/api/specialties/list?...`, que vira `/api/feegow/v1/api/specialties/list?...`.

#### 2. `server/index.js`
Trocar a rota POST única por um wildcard que aceita qualquer método:

```javascript
// Catch-all: /api/feegow/v1/* → https://api.feegow.com/v1/*
app.all('/api/feegow/v1/*', async (req, res) => {
  const feegowPath = req.originalUrl.replace('/api/feegow/v1', '');
  const url = `${FEEGOW_API_URL}${feegowPath}`;
  // proxy com mesmo método, headers, body
});
```

#### 3. `vite.config.ts`
Sem mudança necessária — o proxy dev já mapeia `/api/feegow` → `localhost:3001`, e `/api/feegow/v1/...` é subpath disso.

### Resultado no Network

```text
GET /api/feegow/v1/api/specialties/list?unidade_id=0
GET /api/feegow/v1/api/professional/list?especialidade_id=1
GET /api/feegow/v1/api/company/list-unity
POST /api/feegow/v1/api/appoints/new-appoint  (com body JSON)
```

### Arquivos alterados
| Arquivo | Mudança |
|---|---|
| `src/services/api/apiConfig.ts` | feegowFetch faz fetch direto em `/api/feegow/v1` + path |
| `server/index.js` | Rota wildcard `app.all('/api/feegow/v1/*')` substitui POST tunnel |

