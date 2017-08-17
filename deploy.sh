#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail
cd "$(dirname "$0")"

WEB_ROOT="html.spec.whatwg.org"
DEPLOY_USER="annevankesteren"

SERVER="75.119.197.251"
SERVER_PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDP7zWfhJdjre9BHhfOtN52v6kIaDM/1kEJV4HqinvLP2hzworwNBmTtAlIMS2JJzSiE+9WcvSbSqmw7FKmNVGtvCd/CNJJkdAOEzYFBntYLf4cwNozCRmRI0O0awTaekIm03pzLO+iJm0+xmdCjIJNDW1v8B7SwXR9t4ElYNfhYD4HAT+aP+qs6CquBbOPfVdPgQMar6iDocAOQuBFBaUHJxPGMAG0qkVRJSwS4gi8VIXNbFrLCCXnwDC4REN05J7q7w90/8/Xjt0q+im2sBUxoXcHAl38ZkHeFJry/He2CiCc8YPoOAWmM8Vd0Ukc4SYZ99UfW/bxDroLHobLQ9Eh"

SHA=$(git rev-parse HEAD)

# Environment variables set by CI
TRAVIS_PULL_REQUEST=${TRAVIS_PULL_REQUEST:-false}

# Work in the parent directory
cd ..

# Build the spec into the out directory
./html-build/build.sh

# Conformance-check the result
echo "Downloading and running conformance checker..."
curl --remote-name --fail https://sideshowbarker.net/nightlies/jar/vnu.jar
java -jar vnu.jar --skip-non-html html-build/output

mkdir html-build/output/commit-snapshots
cp html-build/output/index.html "html-build/output/commit-snapshots/$SHA"

# Note: $TRAVIS_PULL_REQUEST is either a number or false, not true or false.
# https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "Skipping deploy for non-master"
  exit 0
fi

echo ""
find html-build/output -type f -print
echo ""

chmod 600 html/deploy_key
eval "$(ssh-agent -s)"
ssh-add html/deploy_key

# scp to the WHATWG server
echo "$SERVER $SERVER_PUBLIC_KEY" > known_hosts
scp -r -o UserKnownHostsFile=known_hosts html-build/output "$DEPLOY_USER@$SERVER:$WEB_ROOT"
