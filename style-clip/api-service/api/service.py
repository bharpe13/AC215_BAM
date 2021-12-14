from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import asyncio
import pandas as pd
import time

import os
from fastapi import File, Form, Query
from fastapi.responses import Response, FileResponse
from tempfile import TemporaryDirectory
from api import model

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def get_index():
    return {
        "message": "Welcome to the API Service"
    }


@app.post("/predict")
async def predict(
        file: bytes = File(...),
        neutral: str = Form(...),
        target: str = Form(...)
):
    print("predict file:", len(file), type(file))

    # Save the image
    if not os.path.exists('outputs'):
        os.makedirs('outputs')

    image_name = "image-{}.png".format(int(time.time()))
    image_path = os.path.join("outputs", image_name)
    with open(image_path, "wb") as output:
        output.write(file)

    # Make prediction
    prediction_results = model.make_prediction(image_path,neutral,target)["new_image"]
    new_image_name = "image-{}.png".format(int(time.time()))
    new_image_path = os.path.join("outputs", new_image_name)

    # Save new image to a path, so GET request can get it later
    prediction_results.save(new_image_path)

    # return image path to prediction result
    return {"image": new_image_path}

@app.get("/get_image")
async def get_image(
    image_path: str = Query(..., description="Image Path")
):
    return FileResponse(image_path, media_type="image/png")