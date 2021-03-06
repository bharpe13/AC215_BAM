BAM - Improved StyleCLIP
==============================

Project Organization
------------
      .
      ├── LICENSE
      ├── README.md
      ├── style-clip
      │   ├── api-service
      │   ├── frontend-react
      │   ├── deployment
      │   ├── persistent-folder
      │   ├── secrets
      ├── submissions
      │   ├── milestone1_BAM
      │   ├── milestone2_BAM
      │   ├── milestone3_BAM
      ├── notebooks
      └── ├── training_notebook.ipynb
      

--------

# How to Run

- cd into Deployment, run sh docker-shell.sh
- Follow same instructions as mushroom app to setup inventory.yml to work with your GCP account
- Run ansible-playbook deploy-k8s-cluster.yml -i inventory.yml --extra-vars cluster_state=present
- This will pull the frontend and api-service containers from docker hub and create a single cluster with a P100 GPU. We need a GPU with a compute capability score of at least 5.2 and the P100 is the cheapest that works. I've found the most success running in europe-west1-b, but it's still fairly inconsistent.
- Once the script has run, it will still take a while for the api container to get set up (it's like a 20GB container), you can check progress in the GCP console.
- Then simply access the app using the ingress IP printed out in the terminal with sslip.io.

# Using a custom model

- We can run our app using either the pre-trained weights, or with our model trained via transfer learning.
- To change model, make sure the .pt file is uploaded to api-service/api/encoder4editing. Then, go into api-service/api/model.py and on line 39, change the model_path variable to the new model.
- You'll then have to rebuild the api-service container, push to docker hub/GCR, and then edit deployment/deploy-k8s-cluster.yml on line 191 to have the link to the new container
- Note that in order to do this, you'll also have to download all the big files to the api-service folder as described below.

- You can find two versions of our transfer-learned models here: https://drive.google.com/file/d/1xTvDYu66VEDMwCOPqtp-AS696Du_E6tA/view?usp=sharing

# Components

## Frontend

Users can upload an image that they wish to transform, along with text descriptions of the input and target images. After the models transform the input image using the text, the result is displayed on the frontend, below the original image. All of these features are displayed for the user using react frontent, specifically with the Home component and the DataService.

## API

The image and text descriptions which users enter into the frontend are passed to the backend using the API and used to transform the image. The API saves the output image on the backend and returns the path to the created image. The frontend component then submits a new API request for the image using the path (this is the same implementation used in Shivas's react tutorial). This implementation can be found in style-clip/api-service/model.py and service.py.

The biggest challenge we faced was setting up CUDA to work with the api-service docker container. Unfortunately, the StyleCLIP model currently requires CUDA, even just for prediction. In the style-clip/api-service folder, the Dockerfile has what finally was the correct combination of countless dependencies and settings that allowed us to containerize this model. The resulting container is huge (~21GB) and takes around 1.5 hours to fully build, but even working with Shivas, we were unable to find a simpler solution. 

Another quirk is that due to the version of PyTorch/CUDA we're using, the container won't run with a GPU worse than a Tesla P100 (it complains about the compute capability being too low if you try to use a K80). The official StyleCLIP implementation runs on a K80 on Colab, but their Torch/CUDA setup is perfect and I spent countless hours trying to replicate it without success. I had to do all my testing on a pre-configured marketplace VM with a P100 for that reason, but it does work! This is why I had to set the GCP region to europe-west1-b - it's the region that I found had the most consistent supply of P100s.

## Models

The image transformation occurs through the coordination of several models. First photos are passed through an ‘RGB’ converter from the PIL module to standardize their format. Photos are then resized and passed through an encoder. StyleCLIP makes use of StyleGAN wic employs a specific encode built to perform image manipulation. It is this encoder which can easily be trained on photos of a wide variety of subjects. In conjunction with a CLIP model, specific text prompts are then mapped to specific directions in StyleGAN’s latent space. For uploaded images, which may not have a centered face, a pre-trained face finder aligns the face in the center of the image. 

## Large Files:
A few files are too large to upload so here are instructions to get them. We have local copies that we've been using to run, but couldn't upload to git.

ffhq.pkl
- Download from https://nvlabs-fi-cdn.nvidia.com/stylegan2/networks/stylegan2-ffhq-config-f.pkl
- Rename as api/StyleCLIP/global_directions/model/ffhq.pkl

ffhq npy files
- Once the api-service container is up and running, exec into it.
- cd to api/StyleCLIP/global_directions and run the following three commands:
- python GetCode.py --dataset_name ffhq --code_type 'w' 
- python GetCode.py --dataset_name ffhq --code_type 's' 
- python GetCode.py --dataset_name ffhq --code_type 's_mean_std' 
- This should create 3 files in api/StyleCLIP/global_directions/npy/ffhq

dlib face predictor
- Download from http://sourceforge.net/projects/dclib/files/dlib/v18.10/shape_predictor_68_face_landmarks.dat.bz2
- Rename as api/encoder4editing/shape_predictor_68_face_landmarks.dat

encoder weights
- Download from https://drive.google.com/drive/u/1/folders/1DoxQhNgNV4FPgifsln8h0kPLkmKNVm9Z
- Rename as api/encoder4editing/e4e_ffhq_encode.pt

<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
