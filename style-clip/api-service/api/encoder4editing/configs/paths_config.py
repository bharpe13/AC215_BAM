dataset_paths = {
	#  Face Datasets (In the paper: FFHQ - train, CelebAHQ - test)
	'ffhq': '/content/StyleCLIP/global_directions/data/ffhq/',
	'celeba_test': '',

	#  Cars Dataset (In the paper: Stanford cars)
	'cars_train': '',
	'cars_test': '',

	#  Horse Dataset (In the paper: LSUN Horse)
	'horse_train': '',
	'horse_test': '',

	#  Church Dataset (In the paper: LSUN Church)
	'church_train': '',
	'church_test': '',

	#  Cats Dataset (In the paper: LSUN Cat)
	'cats_train': '',
	'cats_test': '',
  'celeba_hq': '/content/encoder4editing/datasets/celeba_hq/data1024x1024/'
}

model_paths = {
	'stylegan_ffhq': '/content/encoder4editing/pretrained_models/stylegan2-ffhq-config-f.pt',
	'ir_se50': '/content/encoder4editing/pretrained_models/model_ir_se50.pth',
	'shape_predictor': '/content/encoder4editing/pretrained_models/shape_predictor_68_face_landmarks.dat',
	'moco': '/content/encoder4editing/pretrained_models/moco_v2_800ep_pretrain.pth'
}
