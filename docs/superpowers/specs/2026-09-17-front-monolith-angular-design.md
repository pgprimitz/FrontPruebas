# Front monolito Angular 21

SPA única para 12 grupos. Visual unificado con `generic-ui` ([PiposLibrary](https://github.com/pgprimitz/PiposLibrary.git)). Se borra el prototipo React.

## Stack

- Angular 21 standalone, CSR, routing. Sin SSR.
- `generic-ui` vía `"generic-ui": "file:../PiposLibrary/dist/generic-ui"`.
- Estilos: `@import 'generic-ui/theme.css'`. Sin Tailwind, Material, lucide, NES.css.
- Deploy: GitHub Pages, `baseHref` de producción `/FrontPruebas/`.

## Carpetas

```
src/app/
  core/          sesión mock + mocks de datos
  layout/        header autenticado + router-outlet
  pages/         login, cursos, curso, notificaciones, mensajes, perfil
  teams/team-01 … team-12
```

## Rutas

| Ruta | Guard |
|---|---|
| `/login` | público |
| `/my-courses` | autenticado |
| `/course/:id/simplified` | autenticado |
| `/notifications` | autenticado |
| `/messages` | autenticado |
| `/profile` | autenticado |
| `/teams/01` … `/teams/12` | autenticado, lazy |
| `*` | → `/my-courses` |

## Auth

Login mock: rol alumno / profesor / admin. `SessionService` guarda rol en `sessionStorage`. Sin HTTP.

## Equipos

Cada grupo trabaja solo en `src/app/teams/team-XX`. Shell, `core/` y `pages/` son del monolito. HTTP del microservicio de cada grupo vive en su carpeta.
