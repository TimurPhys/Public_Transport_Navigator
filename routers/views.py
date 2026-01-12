from fastapi import Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")

@router.get("/")
async def get_html(request: Request):
    language = request.cookies.get("language", "RU")

    BASE_DIR = Path(__file__).resolve().parent.parent
    file_path = BASE_DIR / "static" / "json" / "translation" / f"{language}.json"
    with open(file_path, encoding="utf-8") as f:
        translations = json.load(f)

    map_type = request.cookies.get("map_type", "standard")
    return templates.TemplateResponse("index.html", {"request": request, "translations": translations, "map_type": map_type})

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

@router.get("/manifest.json", response_class=FileResponse)
async def get_manifest():
    return "app/manifest.json"

@router.get("/sw.js", response_class=FileResponse)
async def get_service_worker():
    return "/app/static/js/pwa/sw.js"