from fastapi import Request
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter
import json
import os
from pathlib import Path

router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/")
async def get_html(request: Request):
    language = request.cookies.get("language", "LV")

    BASE_DIR = Path(__file__).resolve().parent.parent
    file_path = BASE_DIR / "static" / "json" / "translation" / f"{language}.json"
    with open(file_path, encoding="utf-8") as f:
        translations = json.load(f)

    map_type = request.cookies.get("map_type", "standard")
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "translations": translations, "map_type": map_type},
    )


@router.post("/settings")
async def settings(request: Request):
    form_data = await request.form()
    chosen_language = form_data.get("language")
    map_type = form_data.get("map-type")
    print(chosen_language, map_type)

    response = RedirectResponse(url="/", status_code=303)
    response.set_cookie("language", chosen_language)
    response.set_cookie("map_type", map_type)
    return response


@router.get("/manifest.json")
async def get_manifest():
    file_path = "manifest.json"

    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/json")
    return {"error": "File manifest.js not found"}


@router.get("/sw.js")
async def get_service_worker():
    file_path = "static/js/pwa/sw.js"

    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/javascript")
    return {"error": "File sw.js not found"}
