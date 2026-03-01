---
description: Guidance for REST API testing automation, assertions, variable management, CLI execution, and CI/CD reporting patterns.
---

# API Testing Automation

## Purpose

Provides reusable guidance for designing, executing, and reporting automated API tests using CLI-based collection runners and structured assertion patterns. Framework-agnostic: applicable to Newman, k6, pytest-requests, or any HTTP test runner.

## When to Apply

- Creating or modifying API test collections or suites
- Writing test assertions for HTTP responses
- Configuring headless test execution (local or CI/CD)
- Setting up test reporting and artifact collection
- Managing test data, environments, and variable scopes

---

## Core Principles

### 1. Three-Layer Assertion Model

Every request must be validated at three levels:

```javascript
// Layer 1 — HTTP status
pm.test("Status code is 200", () => pm.response.to.have.status(200));

// Layer 2 — Response time threshold
pm.test("Response time is acceptable", () =>
  pm.expect(pm.response.responseTime).to.be.below(2000)
);

// Layer 3 — JSON Schema contract
const schema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
    createdAt: { type: "string", format: "date-time" }
  },
  additionalProperties: true
};
pm.test("Response schema is valid", () =>
  pm.response.to.have.jsonSchema(schema)
);
```

### 2. Variable Scope Hygiene

Use the narrowest scope that satisfies the need:

| Scope | Use for | API |
|-------|---------|-----|
| `environment` | Base URLs, auth tokens, credentials | `pm.environment.set(key, value)` |
| `collectionVariables` | IDs or state shared across requests in the same run | `pm.collectionVariables.set(key, value)` |
| `globals` | ⚠️ Avoid — bleeds across all collections | `pm.globals.set(key, value)` |

```javascript
// ✅ Correct: capture a token after a login request
pm.environment.set("authToken", pm.response.json().access_token);

// ✅ Correct: pass a created resource ID to the next request
pm.collectionVariables.set("resourceId", pm.response.json().id);

// ❌ Incorrect: hard-coded values or unnecessary global scope
const token = "Bearer eyJhbGci..."; // never hard-code
pm.globals.set("token", token);
```

### 3. CLI Execution Flags

When running tests from the command line, always include:

- `--bail` — halt execution on the first critical failure, preventing cascading false results
- `--reporters cli,<format>` — combine console output with a structured report
- Explicit `--reporter-*-export` paths so artifacts land in a predictable location

```bash
# Minimal recommended invocation
runner run collection.json \
  --bail \
  --reporters cli,html \
  --reporter-html-export reports/report.html

# With environment and data file
runner run collection.json \
  --environment environments/staging.json \
  --iteration-data data/test-cases.json \
  --bail \
  --reporters cli,html,junit \
  --reporter-html-export reports/report.html \
  --reporter-junit-export reports/results.xml
```

---

## Reporting Strategy

| Format | Purpose | Audience |
|--------|---------|----------|
| CLI | Immediate feedback during local development | Developer |
| HTML (htmlextra / allure) | Rich visual report with response bodies and timings | QA / Team |
| JUnit XML | Machine-readable results for CI pipelines | CI/CD system |

Always upload report artifacts with `if: always()` in CI so reports are preserved even when tests fail.

---

## CI/CD Integration Checklist

- [ ] Trigger on both `push` and `pull_request` events
- [ ] Cache dependency installation (`node_modules`, virtualenv, etc.)
- [ ] Run `npm ci` / equivalent for reproducible installs
- [ ] Upload HTML report as a named artifact
- [ ] Publish JUnit XML results for inline test annotations
- [ ] Pin action/step versions to a specific major version (e.g. `@v4`)

---

## Security Patterns

- Store all credentials in CI secrets or environment files — never in collection JSON
- Rotate tokens via pre-request scripts using a dedicated auth endpoint
- Validate response schemas strictly to detect unexpected data exposure
- Assert on 4xx/5xx status codes in negative test cases to confirm proper error handling
