# This Dockerfile is just used to run on Travis CI in an environment that can easily and repeatedly
# install our build dependencies.
FROM debian:sid

RUN apt-get update && \
    apt-get install -y ca-certificates curl git unzip fp-compiler default-jre

ADD wattsi /whatwg/wattsi

RUN cd /whatwg/wattsi && \
    /whatwg/wattsi/build.sh
ENV PATH="/whatwg/wattsi/bin:${PATH}"

ADD html-build /whatwg/html-build

# Note: we do not ADD /whatwg/html, but instead mount it using --volume in .travis.yml, since it
# contains the deploy_key, and thus should not be part of the image. The image is cached, publicly,
# on Docker Hub.
ENV HTML_SOURCE /whatwg/html

ARG travis_pull_request
ENV TRAVIS_PULL_REQUEST=${travis_pull_request}

ENV SKIP_BUILD_UPDATE_CHECK=true
ENTRYPOINT ["bash", "/whatwg/html/deploy.sh"]
