# Environment variables manager for ratecity apps
## Pre-requisites

- You need to have `kubectl` and `kubeseal` configured
- Use `homebrew` to install both of them

## Steps to use this secrets manager for EKS cluster

  - Within this folder run `npm i -g ./`
  - This will install `seal-secret` command.
  - Now run `seal-secret encrypt` and follow the directions.

- Once the one of the above steps are successfully implemented

  - Run `kubectl apply -f path/to/file/sealedSecrets.json`
# kube-secret-manager
