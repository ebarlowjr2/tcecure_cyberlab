# Pod training progress API (read-only)

Supplies per-pod lab progress to the DigitalRCC portal (`my.digitalrcc.com`) student
dashboard without exposing the verifier, the lab network, or any credentials.

```text
AWX verify jobs -> MCP /lab-status -> tracker portal
                                     GET /api/v1/pods/<pod>/progress  (bearer token)
                                       -> my.digitalrcc.com /student
```

## Endpoint

```text
GET https://training.status.tcecure.com/api/v1/pods/01/progress
Authorization: Bearer <POD_PROGRESS_API_TOKEN>
```

- Read-only: only `GET` is implemented (`POST` returns 405).
- Scoped to the pod in the path; one request can never return another pod's data.
- Returns lab completion only — no student name, email, username, password, or lab
  credentials, and no administrative controls.
- `Cache-Control: no-store`; the underlying verifier runs on its own schedule and
  `checkedAt` is the timestamp of that run (`last_run`).

Responses:

| Situation | Response |
| --- | --- |
| Valid token, known pod | `200` with the payload below |
| Missing/invalid bearer token | `401 {"error":"Unauthorized"}` |
| Pod outside `01`–`20` | `404 {"error":"Unknown pod"}` |
| Verifier data unreachable or pod absent | `200` with `"status": "unavailable"` (never presented as a failed lab) |
| `POD_PROGRESS_API_TOKEN` / `PORTAL_SECRET` unset | `503` |

## Payload

A module is one curriculum course; module ids are the stable course codes
(`AC`, `IA`, `SI`, `SC`, `MP`, `PE`). Percentages are integers 0–100.
`status` and each module `status` are one of `not_started`, `in_progress`,
`completed`, `unavailable`.

Real response for Pod01 (trimmed to three modules):

```json
{
  "podName": "Pod01",
  "studentNumber": "01",
  "checkedAt": "2026-08-18T23:26:05.897674Z",
  "overallPercentage": 25,
  "completedModules": 1,
  "totalModules": 6,
  "currentModule": "IA",
  "status": "in_progress",
  "modules": [
    { "id": "AC", "title": "Access Control", "status": "completed", "percentage": 100, "completedAt": "2026-08-18T23:26:05.897674Z" },
    { "id": "IA", "title": "Identification & Authentication", "status": "in_progress", "percentage": 17, "completedAt": null },
    { "id": "SI", "title": "System & Information Integrity", "status": "not_started", "percentage": 0, "completedAt": null }
  ],
  "trackerUrl": "https://training.status.tcecure.com/pod/01"
}
```

`completedAt` is the verifier run that observed the module complete: the verifier
reports current state, so a true per-module completion time does not exist. It is
`null` for modules that are not complete.

## Tracker host configuration

Set on the tracker deployment (the host serving `training.status.tcecure.com`),
alongside the existing `MCP_URL` / `PORTAL_SECRET`:

```text
POD_PROGRESS_API_TOKEN=<random 32+ byte token, tracker host only>
```

Generate with `openssl rand -base64 48`. Rotate by setting a new value on the
tracker and in the portal at the same time.

## Portal (Vercel) configuration

```text
TRAINING_TRACKER_BASE_URL=https://training.status.tcecure.com
TRAINING_TRACKER_API_TOKEN=<same value as POD_PROGRESS_API_TOKEN>
```

The portal resolves the pod from `student_cohort_assignments.pod_name` (`Pod01` →
`01`) and fetches server-side, so the token is never sent to the browser.

## Network, TLS, and CSP

- `TRACKER_REACHABLE_FROM_VERCEL=yes` — the tracker is published on public HTTPS
  (`443`, nginx) with a publicly trusted Let's Encrypt certificate
  (`CN=training.status.tcecure.com`, renewed Aug 13 2026, expires Nov 11 2026), so
  no firewall change, tunnel, or push poller is required. Nothing else about the lab
  network is exposed: Proxmox `8006`, RDP, and the MCP service stay internal.
- The portal must call this endpoint **server-side** (route handler or server
  component). Do not fetch it from the browser: that would leak the token and need a
  CORS allowance. The endpoint deliberately sends no `Access-Control-Allow-Origin`.
- No CSP change is needed for server-side fetches. Linking students to
  `trackerUrl` is a normal outbound link; if the portal ever embeds the tracker in
  an iframe, that needs `frame-src https://training.status.tcecure.com` plus an
  nginx `X-Frame-Options`/`frame-ancestors` allowance on the tracker.
- Token rotation and the 90-day certificate renewal are the only recurring items.
