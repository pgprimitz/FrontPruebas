# FrontPruebas

SPA Angular 21 del monolito TUP. El visual sale de `generic-ui` ([PiposLibrary](https://github.com/pgprimitz/PiposLibrary)).

## Arranque local

La librería se consume como carpeta hermana (todavía no está en npm):

```bash
git clone https://github.com/pgprimitz/PiposLibrary.git
cd PiposLibrary
npm install
npm run build
```

En este repo:

```bash
npm install
npm start
```

Si `generic-ui` se instala como symlink y ves `NG0203` en `input()`, instalá con `install-links` (ya está en `.npmrc`) para que Angular no se duplique con el de PiposLibrary.

Queda en `http://localhost:4200`.

## Dónde trabajar

| Carpeta | Quién |
|---|---|
| `src/app/layout`, `src/app/core`, `src/app/pages` | esqueleto compartido |
| `src/app/teams/team-01` … `team-12` | cada grupo |

Rutas de equipo: `/teams/01` … `/teams/12`.

## Build

`npm run build` usa `baseHref` `/FrontPruebas/` (GitHub Pages).
