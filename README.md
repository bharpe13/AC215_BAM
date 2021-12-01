AC215-Template
==============================

AC215

Project Organization
------------
      .
      ├── LICENSE
      ├── Makefile
      ├── README.md
      ├── models
      ├── notebooks
      ├── references
      ├── requirements.txt
      ├── setup.py
      ├── src
      │   ├── __init__.py
      │   └── build_features.py
      ├── submissions
      │   ├── milestone1_groupname
      │   ├── milestone2_groupname
      │   ├── milestone3_groupname
      │   └── milestone4_groupname
      └── test_project.py

--------

# Components

## Frontend

Users can upload an image that they wish to transform, along with text descriptions of the input and target images. After the models transform the input image using the text, the result is displayed on the frontend, below the original image. All of these features are displayed for the user using react frontent, specifically with the Home component and the DataService.

## API

The image and text descriptions which users enter into the frontend are passed to the backend using the API and used to transform the image. The API saves the output image on the backend and returns the path to the created image. The frontend component then submits a new API request for the image using the path (this is the same implementation used in Shivas's react tutorial). This implementation can be found in style-clip/api-service/model.py and service.py.

The biggest challenge we faced was setting up CUDA to work with the api-service docker container. Unfortunately, the StyleCLIP model currently requires CUDA, even just for prediction. In the style-clip/api-service folder, the Dockerfile has what finally was the correct combination of countless dependencies and settings that allowed us to containerize this model. The resulting container is huge (~21GB) and takes around 1.5 hours to fully build, but even working with Shivas, we were unable to find a simpler solution. 

## Models

The image transformation occurs through the coordination of several models. First photos are passed through an ‘RGB’ converter from the PIL module to standardize their format. Photos are then resized and passed through an encoder. StyleCLIP makes use of StyleGAN wic employs a specific encode built to perform image manipulation. It is this encoder which can easily be trained on photos of a wide variety of subjects. In conjunction with a CLIP model, specific text prompts are then mapped to specific directions in StyleGAN’s latent space. For uploaded images, which may not have a centered face, a pre-trained face finder aligns the face in the center of the image. 


<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
