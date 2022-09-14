FROM node:14.18.0 as builder

ARG YARN_VERSION=1.22.4

WORKDIR /openelb

ADD . /openelb/

RUN npm install yarn@${YARN_VERSION}

RUN yarn && yarn build

FROM nginx

COPY --from=builder /openelb/build /openelb

