# Uselivinha

Controle de despesas com dados locais e sincronizacao via Supabase.

## Abrir localmente

Abra `Abrir Livinha.command` pelo Finder ou rode:

```bash
node server-local.mjs
```

Depois acesse:

```txt
http://127.0.0.1:4173/
```

## App publicado

URL atual:

```txt
https://lustrous-arithmetic-d2be18.netlify.app/
```

O deploy atual foi feito pelo Netlify Drop, sem GitHub.

## Supabase Auth

Em Authentication -> URL Configuration:

- Site URL: `https://lustrous-arithmetic-d2be18.netlify.app`
- Redirect URLs:
  - `https://lustrous-arithmetic-d2be18.netlify.app/*`
  - `http://127.0.0.1:4173/*`

O app usa uma chave `sb_publishable_...`, apropriada para frontend publico. Nao coloque chaves secretas ou `service_role` no navegador.
