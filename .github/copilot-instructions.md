# Copilot Instructions — Newman API Automation Framework

Estas reglas guían a GitHub Copilot para modernizar y mantener la calidad del código en este repositorio de automatización de APIs con Newman.

---

## Upgrade Pattern — Validaciones de Esquema

Al sugerir scripts de test en colecciones Postman, **siempre** incluir validaciones de esquema JSON además de aserciones de estado HTTP. No es suficiente verificar solo el código de respuesta.

**Patrón obligatorio:**
```javascript
// ✅ Correcto: validación de esquema + estado HTTP + tiempo de respuesta
pm.test("Status code is 200", () => pm.response.to.have.status(200));

pm.test("Response time is acceptable", () =>
  pm.expect(pm.response.responseTime).to.be.below(2000)
);

const schema = {
  type: "object",
  properties: {
    url: { type: "string" },
    args: { type: "object" }
  },
  required: ["url"],
  additionalProperties: true
};
pm.test("Response schema is valid", () => pm.response.to.have.jsonSchema(schema));

// ❌ Incorrecto: solo aserción de estado HTTP
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

---

## Clean Scripts — Gestión de Variables

**Prohibido** el uso de variables globales (`pm.globals.set`) innecesarias. Usar siempre el scope apropiado:

```javascript
// ✅ Correcto: scope de entorno para credenciales de sesión
pm.environment.set("authToken", pm.response.json().access_token);

// ✅ Correcto: scope de colección para datos compartidos entre requests
pm.collectionVariables.set("userId", pm.response.json().id);

// ❌ Incorrecto: variables globales o tokens hard-codeados
pm.globals.set("token", "eyJhbGci...hardcoded");
const token = "Bearer abc123"; // nunca hardcodear tokens
```

---

## Newman Best Practices — Comandos CLI

Al sugerir comandos de Newman, **siempre** incluir:
- `--bail` para detener la ejecución ante el primer fallo crítico.
- `--reporters cli,htmlextra` para reporte visual en consola y HTML.
- `--reporter-htmlextra-export` para especificar la ruta del reporte HTML.

**Comandos recomendados:**
```bash
# Ejecución estándar
newman run src/collections/postman_echo.postman_collection.json \
  --bail \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/report.html

# Con environment específico
newman run src/collections/postman_echo.postman_collection.json \
  --environment src/environments/production.postman_environment.json \
  --bail \
  --reporters cli,htmlextra,junit \
  --reporter-htmlextra-export newman/report.html \
  --reporter-junit-export newman/results.xml

# Con datos parametrizados (data-driven)
newman run src/collections/postman_echo.postman_collection.json \
  --iteration-data src/data/test-data.json \
  --bail \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export newman/report.html
```

---

## Estructura de Archivos

Mantener la siguiente convención de estructura:
```
src/
  collections/    # Archivos .postman_collection.json
  environments/   # Archivos .postman_environment.json
  data/           # Archivos CSV/JSON para pruebas parametrizadas
newman/           # Reportes generados (ignorado por git)
```

---

## Reglas de Calidad Adicionales

- Todo nuevo request debe tener al menos un test de estado HTTP, uno de tiempo de respuesta y uno de esquema JSON.
- Los nombres de variables en `pm.environment` y `pm.collectionVariables` deben usar `camelCase`.
- Los pre-request scripts no deben hacer llamadas HTTP externas directas; usar variables de entorno para URLs base.
- Ante cualquier autenticación dinámica (OAuth, JWT), el token debe obtenerse en un request de setup y almacenarse con `pm.environment.set`.
