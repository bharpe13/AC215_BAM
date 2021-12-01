See main readme for full details on implementation.

See video for application demo (instead of screenshots)

Kubernetes script can be found at style-clip/deployment/deploy-k8s-cluster.yml

All the other ansible scripts in the deployment folder have also been updated and deploy the containers on Google's "Deep Learning VM" - as mentioned in the other readme, this was the only way to actually run our container since none of us have GPUs.

Sorry in advance if this is difficult to parse, there's unfortunately a lot going on and it was extremely difficult to get the model to run with CUDA. Please reach out if anything is unclear!

