from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import httpx
import os
import json
import datetime

app = FastAPI(title="CyberLab MCP Server", version="2.2")

AWX_URL = os.getenv("AWX_URL", "http://192.168.1.103:30080/api/v2")
AWX_TOKEN = os.getenv("AWX_TOKEN", "")
PORTAL_SECRET = os.getenv("PORTAL_SECRET")
if not PORTAL_SECRET:
    raise RuntimeError("PORTAL_SECRET environment variable must be set")

security = HTTPBearer()

ROLE_PERMISSIONS = {
    "global_admin": ["reset_pod", "reseed_lab", "verify_lab"],
    "cyberlab_admin": ["reset_pod", "reseed_lab"],
    "student": [],
}

TOOL_TEMPLATES = {
    "reset_pod": 10,
    "reseed_lab": 11,
    "verify_lab": 12,
}


class UserContext(BaseModel):
    id: str
    email: str
    role: str


class ToolRequest(BaseModel):
    user: UserContext
    action: str
    payload: dict


def get_awx_headers():
    return {
        "Authorization": f"Bearer {AWX_TOKEN}",
        "Content-Type": "application/json",
    }


def verify_portal_secret(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != PORTAL_SECRET:
        raise HTTPException(status_code=401, detail="Invalid portal secret")
    return credentials


def check_permission(role: str, action: str) -> bool:
    allowed = ROLE_PERMISSIONS.get(role, [])
    return action in allowed


async def call_awx(template_id: int, extra_vars: dict) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{AWX_URL}/job_templates/{template_id}/launch/",
            headers=get_awx_headers(),
            json={"extra_vars": json.dumps(extra_vars)},
        )
    if not r.is_success:
        try:
            detail = r.json()
        except (json.JSONDecodeError, ValueError):
            detail = r.text
        raise HTTPException(status_code=r.status_code, detail=f"AWX error: {detail}")
    try:
        body = r.json()
    except (json.JSONDecodeError, ValueError):
        body = {}
    return {"awx_status": r.status_code, "job": body.get("id")}


@app.post("/tools/reset_pod")
async def reset_pod(req: ToolRequest, _auth: HTTPAuthorizationCredentials = Depends(verify_portal_secret)):
    if not check_permission(req.user.role, "reset_pod"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use reset_pod")

    pod_id = req.payload.get("pod_id")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    try:
        awx_result = await call_awx(TOOL_TEMPLATES["reset_pod"], {"pod_id": pod_id})
        return {"status": "launched", "tool": "reset_pod", "pod_id": pod_id, **awx_result}
    except HTTPException as e:
        raise HTTPException(status_code=502, detail=e.detail)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.post("/tools/reseed_lab")
async def reseed_lab(req: ToolRequest, _auth: HTTPAuthorizationCredentials = Depends(verify_portal_secret)):
    if not check_permission(req.user.role, "reseed_lab"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use reseed_lab")

    pod_id = req.payload.get("pod_id")
    lab = req.payload.get("lab")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    try:
        awx_result = await call_awx(TOOL_TEMPLATES["reseed_lab"], {"pod_id": pod_id, "lab": lab or ""})
        return {"status": "launched", "tool": "reseed_lab", "pod_id": pod_id, "lab": lab, **awx_result}
    except HTTPException as e:
        raise HTTPException(status_code=502, detail=e.detail)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.post("/tools/verify_lab")
async def verify_lab(req: ToolRequest, _auth: HTTPAuthorizationCredentials = Depends(verify_portal_secret)):
    if not check_permission(req.user.role, "verify_lab"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use verify_lab")

    pod_id = req.payload.get("pod_id")
    lab = req.payload.get("lab")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    try:
        awx_result = await call_awx(TOOL_TEMPLATES["verify_lab"], {"pod_id": pod_id, "lab": lab or ""})
        return {"status": "launched", "tool": "verify_lab", "pod_id": pod_id, "lab": lab, **awx_result}
    except HTTPException as e:
        raise HTTPException(status_code=502, detail=e.detail)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.get("/lab-status")
async def lab_status(_auth: HTTPAuthorizationCredentials = Depends(verify_portal_secret)):
    """Fetch the latest auto-verify job results from AWX.

    Queries AWX for the most recent completed verify job and returns
    the structured lab completion data for all pods.
    """
    # Lab definitions for AC and IA courses
    ac_labs = [
        "L1.1", "L1.2", "L1.3",
        "L2.1", "L2.2", "L2.3",
        "L3.1", "L3.2", "L3.3",
        "L4.1", "L4.2", "L4.3",
    ]
    ia_labs = [
        "M1-L1", "M1-L2", "M1-L3",
        "M2-L1", "M2-L2", "M2-L3",
        "M3-L1", "M3-L2", "M3-L3",
        "M4-L1", "M4-L2", "M4-L3",
    ]

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get latest completed verify job
            verify_template_id = TOOL_TEMPLATES.get("verify_lab", 12)
            r = await client.get(
                f"{AWX_URL}/jobs/",
                headers=get_awx_headers(),
                params={
                    "job_template": verify_template_id,
                    "status": "successful",
                    "order_by": "-finished",
                    "page_size": 1,
                },
            )

            pods: dict = {}
            last_run = None

            if r.is_success:
                try:
                    data = r.json()
                except (json.JSONDecodeError, ValueError):
                    data = {}
                results = data.get("results", [])
                if results:
                    job = results[0]
                    last_run = job.get("finished")
                    job_id = job.get("id")

                    # Fetch job detail to extract artifacts
                    try:
                        artifacts_r = await client.get(
                            f"{AWX_URL}/jobs/{job_id}/",
                            headers=get_awx_headers(),
                        )
                        if artifacts_r.is_success:
                            job_detail = artifacts_r.json()
                            artifacts = job_detail.get("artifacts", {})
                            if artifacts:
                                pods = artifacts
                    except (json.JSONDecodeError, ValueError):
                        pass

            # If we couldn't get real data from AWX, return the structure
            # with all labs marked as incomplete so the UI still renders
            if not pods:
                for i in range(1, 21):
                    pad = f"{i:02d}"
                    pod_key = f"pod{pad}"
                    pod_labs: dict = {}
                    for lab in ac_labs:
                        pod_labs[lab] = {"completed": False, "reason": "Not yet verified", "course": "AC"}
                    for lab in ia_labs:
                        pod_labs[lab] = {"completed": False, "reason": "Not yet verified", "course": "IA"}
                    pods[pod_key] = pod_labs

            return {
                "pods": pods,
                "last_run": last_run,
                "courses": {
                    "AC": {"name": "Access Control", "labs": ac_labs},
                    "IA": {"name": "Identification & Authentication", "labs": ia_labs},
                },
            }
    except httpx.HTTPError as e:
        # If AWX is unreachable, return empty structure so UI still works
        pods = {}
        for i in range(1, 21):
            pad = f"{i:02d}"
            pod_key = f"pod{pad}"
            pod_labs = {}
            for lab in ac_labs:
                pod_labs[lab] = {"completed": False, "reason": "AWX unreachable", "course": "AC"}
            for lab in ia_labs:
                pod_labs[lab] = {"completed": False, "reason": "AWX unreachable", "course": "IA"}
            pods[pod_key] = pod_labs
        return {
            "pods": pods,
            "last_run": None,
            "error": f"AWX connection error: {str(e)}",
            "courses": {
                "AC": {"name": "Access Control", "labs": ac_labs},
                "IA": {"name": "Identification & Authentication", "labs": ia_labs},
            },
        }


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.2", "role_enforcement": True, "auth": True}


@app.get("/tools")
async def list_tools():
    return {
        "tools": [
            {"name": "reset_pod", "description": "Reset a pod to clean state", "template_id": TOOL_TEMPLATES["reset_pod"]},
            {"name": "reseed_lab", "description": "Reseed a lab environment", "template_id": TOOL_TEMPLATES["reseed_lab"]},
            {"name": "verify_lab", "description": "Verify lab configuration", "template_id": TOOL_TEMPLATES["verify_lab"]},
            {"name": "lab_status", "description": "Get lab completion status for all pods"},
        ]
    }
