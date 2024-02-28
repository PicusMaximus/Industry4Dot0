openapi-generator-cli generate -i ../../APIVorlage.yaml -g python-flask -o ../src/generated/server/ `
--openapi-generator-ignore-list "README.md,.dockerignore,.gitignore,.openapi-generator-ignore,.travis.yml,Dockerfile,git_push.sh,tox.ini,test-requirements.txt,test/,tests/"
