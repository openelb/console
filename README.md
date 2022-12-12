# OpenELB Console

OpenELB Console is the web-based UI for OpenELB.

## Getting Started

Console should be always used with OpenELB. 
The following will show you how to build console from source code.

### Prerequisite

#### Node.js

Console is written using Javascript. If you don't have a Node.js development environment, please [set it up](https://nodejs.org/en/download/). The minimum version required is 14.18.

#### Yarn

We use [Yarn](https://yarnpkg.com/) to do package management. If you don't have yarn, use the following to install:

```
npm install -g yarn@1.22.19
```

The minimum version required is 1.22.19, but you can use a newer version.

#### [Optional] Docker

This is optional. If you just want to test and build on your local environment, there is no need to install docker. Otherwise, you need to install it.

- [Install on Mac](https://docs.docker.com/desktop/mac/install/)
- [Install on Windows](https://docs.docker.com/desktop/windows/install/)
- [Install on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

#### [Optional] Make

This is optional too, we use `make` to reduce hand work, but it's totally ok without it.

## How to debug 

* Clone the repository, and run `yarn`

```sh
git clone https://github.com/openelb/console.git
cd console/
yarn
```
* Make sure there is openelb-manager service of type nodeport in your cluster, if not create it:
```yaml
kind: Service
apiVersion: v1
metadata:
  name: openelb-manager
  namespace: openelb-system
  labels:
    app: openelb-manager
spec:
  ports:
    - name: server
      protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30871
  selector:
    app: openelb-manager
  type: NodePort
```
* Add openelb-manager service address into this function([createURL](https://github.com/openelb/console/blob/ea00c35e70b492990379bfebc41b27174265a083/src/utils/request.js#L98)) as follows:

  > the default port  of openelb-manager service in k8s is `30871` .

```
return `http://${your service machine ip}:${openelb-manager service address}:${port}/${path.trimLeft('/')}`
```

* Run command:

```
yarn start
```

> If you have trouble downloading the dependencies, try the following
>
> `yarn config set registry https://registry.npmmirror.com`

now, you can debug it in chrome browser.

## How to build

### How to build container image

Just run the following command with your real `REPO` address.

```
REPO=yourawesomerepo make container
```

### Run in docker

1. Modify `server.domain:port` in `deploy/default.conf` to the actual deployment address of openelb console.
2. Mount the configuration file into the docker container
3. Expose container port 8088

```
docker run --rm -d --name=openelb-console -v ${PWD}/deploy/default.conf:/etc/nginx/conf.d/default.conf -p 8088:8088 kubesphere/openelb-console:master
```

You can access openelb-console using ${hostIP}:8088. *(hostIP is the ip of the node where the command is run)*

### Run in kubernetes

Check whether the pod and service port information correspond to each other *(You may have modified the port listened by openelb-manager during installation)*. If there is no problem, install it into kubernetes using kubectl.

Use the service of nodeport type to expose the openelb-console service. Port 30870 is used by default.

```
kubectl apply -f deploy/console.yaml
```

### Get the frontend bundle file

If you want to get the frontend file in local machine, you can run:

```
yarn build
```
the bundle file will exist in the `build` directory.

## How to submit a PR

Follow [Development Workflow](/docs/development-workflow.md) to commit your codes.

## Support, Discussion, and Community

If you need any help with OpenELB, please join us at [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-1ilxbsp39-t4ES4xn5OI0eF5hvOoAhEw).

Please submit any OpenELB Console bugs, issues, and feature requests to [OpenELB Console GitHub Issue](https://github.com/openelb/console/issues).

## Contributing to the project

Welcome to contribute to OpenELB Console, see [Contributing Guide](CONTRIBUTING.md).
