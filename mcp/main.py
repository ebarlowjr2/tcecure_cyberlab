from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import requests
import os
import json
import datetime

app = FastAPI(title="CyberLab MCP Server", version="2.0")

AWX_URL = os.getenv("AWX_URL", "http://192.168.1.60:30080/api/v2")
AWX_TOKEN = os.getenv("AWX_TOKEN", "")
PORTAL_SECRET = os.getenv("PORTAL_SECRET", "cyberlab-portal-secret-key-change-in-production-2026")

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


def check_permission(role: str, action: str) -> bool:
    allowed = ROLE_PERMISSIONS.get(role, [])
    return action in allowed


@app.post("/tools/reset_pod")
async def reset_pod(req: ToolRequest):
    if not check_permission(req.user.role, "reset_pod"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use reset_pod")

    pod_id = req.payload.get("pod_id")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    template_id = TOOL_TEMPLATES["reset_pod"]
    try:
        r = requests.post(
            f"{AWX_URL}/job_templates/{template_id}/launch/",
            headers=get_awx_headers(),
            json={"extra_vars": json.dumps({"pod_id": pod_id})},
            timeout=30,
        )
        return {"status": "launched", "tool": "reset_pod", "pod_id": pod_id, "awx_status": r.status_code, "job": r.json().get("id")}
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.post("/tools/reseed_lab")
async def reseed_lab(req: ToolRequest):
    if not check_permission(req.user.role, "reseed_lab"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use reseed_lab")

    pod_id = req.payload.get("pod_id")
    lab = req.payload.get("lab")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    template_id = TOOL_TEMPLATES["reseed_lab"]
    try:
        r = requests.post(
            f"{AWX_URL}/job_templates/{template_id}/launch/",
            headers=get_awx_headers(),
            json={"extra_vars": json.dumps({"pod_id": pod_id, "lab": lab or ""})},
            timeout=30,
        )
        return {"status": "launched", "tool": "reseed_lab", "pod_id": pod_id, "lab": lab, "awx_status": r.status_code, "job": r.json().get("id")}
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.post("/tools/verify_lab")
async def verify_lab(req: ToolRequest):
    if not check_permission(req.user.role, "verify_lab"):
        raise HTTPException(status_code=403, detail=f"Role '{req.user.role}' cannot use verify_lab")

    pod_id = req.payload.get("pod_id")
    lab = req.payload.get("lab")
    if not pod_id:
        raise HTTPException(status_code=400, detail="pod_id is required")

    template_id = TOOL_TEMPLATES["verify_lab"]
    try:
        r = requests.post(
            f"{AWX_URL}/job_templates/{template_id}/launch/",
            headers=get_awx_headers(),
            json={"extra_vars": json.dumps({"pod_id": pod_id, "lab": lab or ""})},
            timeout=30,
        )
        return {"status": "launched", "tool": "verify_lab", "pod_id": pod_id, "lab": lab, "awx_status": r.status_code, "job": r.json().get("id")}
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AWX connection error: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0", "role_enforcement": True}


@app.get("/tools")
async def list_tools():
    return {
        "tools": [
            {"name": "reset_pod", "description": "Reset a pod to clean state", "template_id": TOOL_TEMPLATES["reset_pod"]},
            {"name": "reseed_lab", "description": "Reseed a lab environment", "template_id": TOOL_TEMPLATES["reseed_lab"]},
            {"name": "verify_lab", "description": "Verify lab configuration", "template_id": TOOL_TEMPLATES["verify_lab"]},
        ]
    }
