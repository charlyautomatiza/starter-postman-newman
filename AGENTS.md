# AGENTS.md — Roles de Automatización para APIs

Este archivo define los roles especializados para la automatización de APIs en este repositorio, basado en Newman y la colección `postman_echo.postman_collection.json`.

---

## 1. API Automation Architect

**Responsabilidades:**

- Modularizar la colección `postman_echo.postman_collection.json` en colecciones por dominio funcional (métodos HTTP, autenticación, utilidades).
- Diseñar flujos de autenticación dinámicos usando variables de entorno (`pm.environment.set`) en lugar de tokens hard-codeados.
- Definir la estrategia de variables: separar datos de entorno (`postman_environment.json`) de datos de prueba (archivos CSV/JSON externos).
- Establecer convenciones de nomenclatura para requests, carpetas y variables dentro de las colecciones.
- Asegurar que las colecciones sean autocontenidas y portables para ejecución en CI/CD.

**Herramientas principales:** Postman Collection Builder, Newman CLI, JSON Schema.

---

## 2. Newman Specialist

**Responsabilidades:**

- Gestionar la ejecución de colecciones por CLI usando Newman con los flags recomendados:
  ```bash
  newman run src/collections/postman_echo.postman_collection.json \
    --bail \
    --reporters cli,htmlextra \
    --reporter-htmlextra-export newman/report.html
  ```
- Configurar y mantener los scripts de `package.json` para distintos entornos (`test:local`, `test:staging`, `test:prod`).
- Integrar reportes con `newman-reporter-htmlextra` para visibilidad técnica y `junit` para integración con CI.
- Gestionar el flag `--bail` para detener la ejecución ante fallos críticos.
- Configurar la ejecución parametrizada con archivos de datos (`--iteration-data`).

**Herramientas principales:** Newman CLI, newman-reporter-htmlextra, GitHub Actions.

---

## 3. Security Auditor Agent

**Responsabilidades:**

- Validar esquemas de respuesta usando JSON Schema dentro de los scripts de test de Postman:
  ```javascript
  const schema = { type: "object", properties: { url: { type: "string" } }, required: ["url"] };
  pm.test("Schema is valid", () => {
    pm.response.to.have.jsonSchema(schema);
  });
  ```
- Identificar y eliminar tokens o credenciales hard-codeadas en las colecciones o entornos.
- Auditar endpoints en busca de respuestas inesperadas (códigos 4xx/5xx no controlados).
- Verificar que los tiempos de respuesta no excedan umbrales definidos:
  ```javascript
  pm.test("Response time < 2000ms", () => pm.expect(pm.response.responseTime).to.be.below(2000));
  ```
- Reportar vulnerabilidades encontradas y proponer mitigaciones.

**Herramientas principales:** AJV (JSON Schema validator), Newman, pm.* API de Postman.
