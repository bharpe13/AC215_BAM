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

Users can upload an image that they wish to transform, along with text descriptions of the input and target images. After the models transform the input image using the text, the result is displayed on the frontend, below the original image. All of these features are displayed for the user using the frontend code, which can be found in *FILENAME*.

## API

The image and text descriptions which users enter into the frontend are passed to the backend using the API and used to transform the image. The API also allows outputs from the models to be passed back to the user through the frontend. The API code can be found in *FILENAME*

## Models

The image transformation occurs through the coordination of several models. First photos are passed through an ‘RGB’ converter from the PIL module to standardize their format. Photos are then resized and passed through an encoder. StyleCLIP makes use of StyleGAN wic employs a specific encode built to perform image manipulation. It is this encoder which can easily be trained on photos of a wide variety of subjects. In conjunction with a CLIP model, specific text prompts are then mapped to specific directions in StyleGAN’s latent space. For uploaded images, which may not have a centered face, a pre-trained face finder aligns the face in the center of the image. 


<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
