<p align="center">
  <a href="https://www.twitch.tv/charlyautomatiza"><img alt="Twitch" src="https://img.shields.io/badge/CharlyAutomatiza-Twitch-9146FF.svg" style="max-height: 300px;"></a>
  <a href="https://discord.gg/wwM9GwxmRZ"><img alt="Discord" src="https://img.shields.io/discord/944608800361570315" style="max-height: 300px;"></a>
  <a href="http://twitter.com/char_automatiza"><img src="https://img.shields.io/badge/@char__automatiza-Twitter-1DA1F2.svg?style=flat" style="max-height: 300px;"></a>
  <a href="https://www.youtube.com/channel/UCwEb6xrQtQCEuN_gNgi_Xfg?sub_confirmation=1"><img src="https://img.shields.io/badge/Charly%20Automatiza-Youtube-FF0000.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
  <a href="https://www.linkedin.com/in/gautocarlos/"><img src="https://img.shields.io/badge/Carlos%20 Gauto-LinkedIn-0077B5.svg" style="max-height: 300px;" style="max-height: 300px;"></a>
</p>

<a href="https://www.postman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-320x132.png" /></a><br />

## API Automation Framework — [Postman](https://www.postman.com/) + [Newman](https://www.npmjs.com/package/newman) + [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)

> Proyecto creado en vivo en [Stream de Twitch](https://www.twitch.tv/charlyautomatiza). Framework de automatización de APIs ejecutable por CLI, con reportes HTML y integración con GitHub Actions.

## Tabla de contenidos

- [Requerimientos](#requerimientos)
- [Instalación](#instalación)
- [Ejecución de tests](#ejecución-de-tests)
- [Scripts disponibles](#scripts-disponibles)
- [Reportes HTML](#reportes-html)
- [Agregar tus propias colecciones](#agregar-tus-propias-colecciones)
- [CI/CD con GitHub Actions](#cicd-con-github-actions)

---

## Requerimientos

- [Node.js](https://nodejs.org/es/download/) 18.x o superior
- [git](https://git-scm.com/downloads)

---

## Instalación

#### Clonar el repositorio:

```bash
git clone https://github.com/charlyautomatiza/starter-postman-newman.git
cd starter-postman-newman
```

#### Instalar dependencias (incluye Newman y newman-reporter-htmlextra):

```bash
npm install
```

---

## Ejecución de tests

#### Ejecutar la suite completa (limpia reportes anteriores y lanza Newman):

```bash
npm test
```

#### Ejecutar directamente con Newman CLI (con reporte HTML y bail ante fallos críticos):

```bash
newman run src/collections/postman_echo.postman_collection.json \
  --bail \
  --reporters cli,htmlextra,junit \
  --reporter-htmlextra-export newman/report.html \
  --reporter-junit-export newman/results.xml
```

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm test` | Limpia reportes anteriores y ejecuta la colección vía TypeScript |
| `npm run test:prod` | Ejecuta la colección directamente con Newman CLI (`--bail`, reportes HTML + JUnit) |
| `npm run clean` | Elimina la carpeta `newman/` con los reportes anteriores |

---

## Reportes HTML

Los reportes de ejecución se generan en la carpeta `newman/` y se eliminan automáticamente al iniciar una nueva ejecución.

#### Ver los reportes generados:

```bash
# Listar reportes disponibles
ls newman/

# Abrir el reporte HTML en el navegador (macOS)
open newman/report.html

# Abrir el reporte HTML en el navegador (Linux)
xdg-open newman/report.html

# Abrir el reporte HTML en el navegador (Windows)
start newman/report.html
```

El reporte HTML (`newman/report.html`) generado por `newman-reporter-htmlextra` incluye:
- Resumen de requests y aserciones
- Tiempos de respuesta por request
- Cuerpos de respuesta expandibles
- Indicadores de fallos y errores

---

## Agregar tus propias colecciones

#### Usando Newman CLI directamente:

```bash
newman run src/collections/yourCollectionName.postman_collection.json \
  --environment src/environments/yourEnvironment.postman_environment.json \
  --bail \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/report.html
```

#### Usando el runner TypeScript (`src/main.ts`):

```typescript
// Colección local
newman.run({
    collection: require('./collections/yourCollectionName.json'),
    reporters: ['cli', 'htmlextra', 'junit'],
}, function (err: Error | null) {
    if (err) { throw err; }
    console.log('Collection run complete!');
});
```

#### Con datos parametrizados (data-driven testing):

```bash
newman run src/collections/postman_echo.postman_collection.json \
  --iteration-data src/data/test-data.json \
  --bail \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/report.html
```

---

## CI/CD con GitHub Actions

El workflow `.github/workflows/postman-runner.yml` ejecuta automáticamente los tests en cada `push` y `pull_request`, publicando el reporte JUnit como resultado de checks.

Para usar tus propias colecciones en CI, actualiza el script `test:prod` en `package.json` con el nombre de tu archivo de colección.
