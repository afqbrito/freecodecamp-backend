#!/bin/bash

# Define o caminho do projeto Python
PYTHON_PROJECT_PATH="./freecodecamp-backend-python"

# Cria a estrutura de diretórios
mkdir -p "$PYTHON_PROJECT_PATH/controllers"
mkdir -p "$PYTHON_PROJECT_PATH/models"
mkdir -p "$PYTHON_PROJECT_PATH/routes"

# Cria o arquivo main.py
cat <<EOL > "$PYTHON_PROJECT_PATH/main.py"
from fastapi import FastAPI
from routes import (
    date_routes,
    exercise_tracker_routes,
    file_metadata_routes,
    hello_routes,
    url_shortener_routes,
    whoami_routes
)

app = FastAPI()

# Inclui as rotas dos diferentes módulos
app.include_router(date_routes.router, prefix="/api")
app.include_router(exercise_tracker_routes.router, prefix="/api/users")
app.include_router(file_metadata_routes.router, prefix="/api/fileanalyse")
app.include_router(hello_routes.router, prefix="/api/hello")
app.include_router(url_shortener_routes.router, prefix="/api/shorturl")
app.include_router(whoami_routes.router, prefix="/api/whoami")

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application"}

# Para executar: uvicorn main:app --reload
EOL

# Cria os arquivos de controlador
cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/date_controller.py"
from fastapi import HTTPException
from datetime import datetime

def get_date(date_string: str = None):
    if date_string is None:
        date = datetime.utcnow()
    else:
        try:
            date = datetime.fromtimestamp(int(date_string))
        except ValueError:
            try:
                date = datetime.fromisoformat(date_string)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid Date")

    return {"unix": int(date.timestamp()), "utc": date.strftime("%a, %d %b %Y %H:%M:%S GMT")}
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/exercise_tracker_controller.py"
from uuid import uuid4
from fastapi import HTTPException
from models.exercise_tracker_model import users, exercises

def create_user(username: str):
    new_user = {"username": username, "_id": str(uuid4())}
    users.append(new_user)
    return new_user

def get_all_users():
    return users

def add_exercise(user_id: str, description: str, duration: int, date: str = None):
    user = next((user for user in users if user["_id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    exercise_date = date or datetime.utcnow().isoformat()
    new_exercise = {
        "description": description,
        "duration": duration,
        "date": exercise_date,
        "_id": user_id,
    }
    exercises.append(new_exercise)
    return {**new_exercise, "username": user["username"]}

def get_exercise_log(user_id: str, from_date: str = None, to_date: str = None, limit: int = None):
    user = next((user for user in users if user["_id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_exercises = [ex for ex in exercises if ex["_id"] == user_id]

    if from_date:
        user_exercises = [ex for ex in user_exercises if ex["date"] >= from_date]

    if to_date:
        user_exercises = [ex for ex in user_exercises if ex["date"] <= to_date]

    if limit:
        user_exercises = user_exercises[:limit]

    return {
        "_id": user_id,
        "username": user["username"],
        "count": len(user_exercises),
        "log": user_exercises,
    }
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/file_metadata_controller.py"
from fastapi import UploadFile, HTTPException
import os

UPLOAD_DIR = "/tmp/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def upload_file(file: UploadFile):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    file_metadata = {
        "name": file.filename,
        "type": file.content_type,
        "size": os.path.getsize(file_location),
    }

    # Limpeza do arquivo após o processamento
    os.remove(file_location)

    return file_metadata
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/hello_controller.py"
def get_hello():
    return {"greeting": "hello API"}
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/url_shortener_controller.py"
import dns.resolver
from fastapi import HTTPException

url_database = {}
url_counter = 1

def create_short_url(url: str):
    global url_counter
    try:
        hostname = dns.resolver.resolve(url, 'A')
    except dns.resolver.NXDOMAIN:
        raise HTTPException(status_code=400, detail="invalid url")

    short_url = next((key for key, value in url_database.items() if value == url), None)
    if not short_url:
        short_url = url_counter
        url_database[short_url] = url
        url_counter += 1

    return {"original_url": url, "short_url": short_url}

def redirect_short_url(short_url: int):
    original_url = url_database.get(short_url)
    if not original_url:
        raise HTTPException(status_code=404, detail="No short URL found for the given input")
    return original_url
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/controllers/whoami_controller.py"
def get_whoami(request):
    ipaddress = request.client.host
    language = request.headers.get("accept-language")
    software = request.headers.get("user-agent")

    return {
        "ipaddress": ipaddress,
        "language": language,
        "software": software,
    }
EOL

# Cria o arquivo de modelo
cat <<EOL > "$PYTHON_PROJECT_PATH/models/exercise_tracker_model.py"
users = []
exercises = []
EOL

# Cria os arquivos de rotas
cat <<EOL > "$PYTHON_PROJECT_PATH/routes/date_routes.py"
from fastapi import APIRouter
from controllers.date_controller import get_date

router = APIRouter()

router.get("/date")(get_date)
router.get("/{date}")(get_date)
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/routes/exercise_tracker_routes.py"
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from controllers.exercise_tracker_controller import create_user, get_all_users, add_exercise, get_exercise_log

router = APIRouter()

class UserModel(BaseModel):
    username: str

class ExerciseModel(BaseModel):
    description: str
    duration: int
    date: str = None

@router.post("/")
def create_user_route(user: UserModel):
    return create_user(user.username)

@router.get("/")
def get_all_users_route():
    return get_all_users()

@router.post("/{user_id}/exercises")
def add_exercise_route(user_id: str, exercise: ExerciseModel):
    return add_exercise(user_id, exercise.description, exercise.duration, exercise.date)

@router.get("/{user_id}/logs")
def get_exercise_log_route(user_id: str, from_date: str = Query(None), to_date: str = Query(None), limit: int = Query(None)):
    return get_exercise_log(user_id, from_date, to_date, limit)
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/routes/file_metadata_routes.py"
from fastapi import APIRouter, File, UploadFile
from controllers.file_metadata_controller import upload_file

router = APIRouter()

@router.post("/")
async def upload_file_route(file: UploadFile = File(...)):
    return upload_file(file)
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/routes/hello_routes.py"
from fastapi import APIRouter
from controllers.hello_controller import get_hello

router = APIRouter()

router.get("/")(get_hello)
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/routes/url_shortener_routes.py"
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from controllers.url_shortener_controller import create_short_url, redirect_short_url

router = APIRouter()

class UrlModel(BaseModel):
    url: str

@router.post("/")
def create_short_url_route(url_data: UrlModel):
    return create_short_url(url_data.url)

@router.get("/{short_url}")
def redirect_short_url_route(short_url: int):
    return redirect_short_url(short_url)
EOL

cat <<EOL > "$PYTHON_PROJECT_PATH/routes/whoami_routes.py"
from fastapi import APIRouter, Request
from controllers.whoami_controller import get_whoami

router = APIRouter()

@router.get("/")
async def get_whoami_route(request: Request):
    return get_whoami(request)
EOL

echo "Python project structure has been initialized with basic content."

