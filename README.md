# OpenELB Console
OpenELB Console is the web-based UI for OpenELB.

## Getting Started

Console should be always used with OpenELB. 
The following will show you how to build console from source code.


### Prerequisite


## How to build

### How to build container image

Just run the following command with your real `REPO` address.
```
REPO=yourawesomerepo make container
```
### run in docker
1. Modify `server.domain:port` in `build/default.conf` to the actual deployment address of openelb console.
2. Mount the configuration file into the docker container
3. Expose container port 8088

```
docker run --rm -d --name=openelb-console -v ${PWD}/build/default.conf:/etc/nginx/conf.d/default.conf -p 8088:8088 kubesphere/openelb-console:master
```

You can access openelb-console using ${hostIP}:8088. *(hostIP is the ip of the node where the command is run)*

### run in kubernetes

Check whether the pod and service port information correspond to each other *(You may have modified the port listened by openelb-manager during installation)*. If there is no problem, install it into kubernetes using kubectl.

Use the service of nodeport type to expose the openelb-console service. Port 30870 is used by default.

```
kubectl apply -f build/console.yaml
```

### run in host



## How to debug


## How to submit a PR

Follow [Development Workflow](/docs/development-workflow.md) to commit your codes.

## Support, Discussion, and Community

If you need any help with OpenELB, please join us at [Slack Channel](https://join.slack.com/t/kubesphere/shared_invite/zt-1ilxbsp39-t4ES4xn5OI0eF5hvOoAhEw).

Please submit any OpenELB Console bugs, issues, and feature requests to [OpenELB Console GitHub Issue](https://github.com/openelb/console/issues).

## Contributing to the project

Welcome to contribute to OpenELB Console, see [Contributing Guide](CONTRIBUTING.md).



