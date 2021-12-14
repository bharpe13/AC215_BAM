import os
import json
import numpy as np
from argparse import Namespace
import time
import sys

sys.path.append(".")
sys.path.append("..")
sys.path.append("encoder4editing/")
sys.path.append("StyleCLIP")

import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
import clip
from api.encoder4editing.models.psp import pSp
from api.StyleCLIP.global_directions.MapTS import GetFs,GetBoundary,GetDt
from api.StyleCLIP.global_directions.manipulate import Manipulator

device = "cuda" if torch.cuda.is_available() else "cpu"
# device = "cpu"
# CUDA_HOME = _find_cuda_home() if torch.cuda.is_available() else None
model, preprocess = clip.load("ViT-B/32", device=device) 
M=Manipulator(dataset_name='ffhq') 
fs3=np.load('./api/StyleCLIP/global_directions/npy/ffhq/fs3.npy')


local_experiments_path = "/persistent"
prediction_model = None
data_details = None
image_width = 224
image_height = 224
num_channels = 3

# Global Variables
EXPERIMENT_ARGS = {
    "model_path": "./api/encoder4editing/e4e_ffhq_encode.pt"
}
EXPERIMENT_ARGS['transform'] = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])])
resize_dims = (256, 256)

model_path = EXPERIMENT_ARGS['model_path']
ckpt = torch.load(model_path, map_location='cpu')
opts = ckpt['opts']
# pprint.pprint(opts)  # Display full options used
# update the training options
opts['checkpoint_path'] = model_path
opts= Namespace(**opts)
net = pSp(opts)
net.eval()
net.cuda()

def run_alignment(image_path):
  import dlib
  from api.encoder4editing.utils.alignment import align_face
  predictor = dlib.shape_predictor("./api/encoder4editing/shape_predictor_68_face_landmarks.dat")
  aligned_image = align_face(filepath=image_path, predictor=predictor) 
  print("Aligned image has shape: {}".format(aligned_image.size))
  return aligned_image 

img_transforms = EXPERIMENT_ARGS['transform']

def run_on_batch(inputs, net):
    images, latents = net(inputs.to(device).float(), randomize_noise=False, return_latents=True)
    return images, latents

def make_prediction(image_path, neutral, target):
    original_image = Image.open(image_path)
    original_image = original_image.convert("RGB")
    input_image = run_alignment(image_path)
    transformed_image = img_transforms(input_image)

    with torch.no_grad():
        images, latents = run_on_batch(transformed_image.unsqueeze(0), net)
        result_image, latent = images[0], latents[0]
    torch.save(latents, './api/encoder4editing/latents.pt')

    # Load & preprocess
    mode='real image'
    img_index = 1

    if mode == 'real image':
        img_index = 0
        latents=torch.load('./api/encoder4editing/latents.pt')
        w_plus=latents.cpu().detach().numpy()
        dlatents_loaded=M.W2S(w_plus)

        img_indexs=[img_index]
        dlatent_tmp=[tmp[img_indexs] for tmp in dlatents_loaded]

    elif mode == 'generated image':
        img_indexs=[img_index]
        dlatent_tmp=[tmp[img_indexs] for tmp in M.dlatents]

    M.num_images=len(img_indexs)
    M.alpha=[0]
    M.manipulate_layers=[0]
    codes,out=M.EditOneC(0,dlatent_tmp) 
    original=Image.fromarray(out[0,0]).resize((512,512))
    M.manipulate_layers=None

    classnames=[target,neutral]
    dt=GetDt(classnames,model)

    # Make prediction
    beta = 0.15
    alpha = 4.1
    M.alpha=[alpha]
    boundary_tmp2,c=GetBoundary(fs3,dt,M,threshold=beta)
    codes=M.MSCode(dlatent_tmp,boundary_tmp2)
    out=M.GenerateImg(codes)
    generated=Image.fromarray(out[0,0])#.resize((512,512))

    return {
        "new_image": generated
    }

