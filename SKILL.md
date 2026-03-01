# SKILL.md — Inventario Técnico del Framework

Inventario de capacidades técnicas del framework tras el upgrade hacia ejecución automatizada con Newman.

---

## Runtime

- **Plataforma:** Node.js (versión recomendada: 18.x o superior).
- **Lenguaje de orquestación:** TypeScript (`src/main.ts`) compilado con `ts-node`.
- **Gestor de paquetes:** npm con `package-lock.json` para reproducibilidad.
- **Ejecución CLI:** Newman ejecuta colecciones Postman directamente desde la línea de comandos, sin necesidad de la UI de Postman.
- **Colección activa:** `src/collections/postman_echo.postman_collection.json` (Postman Echo — cubre métodos HTTP, headers, autenticación, cookies y utilidades).

---

## Reporting Strategy

- **newman-reporter-htmlextra:** Reporte HTML detallado con resumen de requests, tiempos de respuesta, aserciones y cuerpos de respuesta.
  - Salida: `newman/report.html`
  - Comando: `--reporters cli,htmlextra --reporter-htmlextra-export newman/report.html`
- **JUnit XML:** Para integración con GitHub Actions (`mikepenz/action-junit-report`).
  - Salida: `newman/results.xml`
- **CLI Reporter:** Salida en consola para feedback inmediato durante desarrollo local.

---

## Dynamic Assertions

Uso de la API `pm.*` de Postman para validación de contratos y comportamiento:

```javascript
// Validación de estado HTTP
pm.test("Status code is 200", () => pm.response.to.have.status(200));

// Validación de tiempo de respuesta
pm.test("Response time < 2000ms", () => pm.expect(pm.response.responseTime).to.be.below(2000));

// Validación de esquema JSON
const schema = {
  type: "object",
  properties: {
    url: { type: "string" },
    args: { type: "object" }
  },
  required: ["url"]
};
pm.test("Schema is valid", () => pm.response.to.have.jsonSchema(schema));

// Variables de entorno dinámicas (evitar hard-coding)
pm.environment.set("authToken", pm.response.json().token);
pm.collectionVariables.set("lastRequestId", pm.response.json().id);
```

---

## CI/CD Integration

- **GitHub Actions:** Workflow configurado en `.github/workflows/postman-runner.yml`.
  - Triggers: `push` y `pull_request`.
  - Pasos: checkout → setup Node.js → `npm ci` → `npm run test` → publicación de reporte JUnit.
  - Reporte HTML disponible como artefacto de workflow.
- **GitLab CI:** Compatible mediante adaptación del script npm; el mismo comando `npm run test` funciona en cualquier runner con Node.js.
- **Scripts npm disponibles:**
  | Script | Descripción |
  |--------|-------------|
  | `npm test` | Limpia reportes anteriores y ejecuta la colección vía TypeScript (`ts-node`) |
  | `npm run test:prod` | Ejecuta la colección directamente con Newman CLI (`--bail`, reportes HTML + JUnit) |
  | `npm run clean` | Elimina la carpeta `newman/` con reportes anteriores |
