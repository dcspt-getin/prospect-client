export REACT_APP_ENV=production
export PUBLIC_URL=/

yarn build
scp -r ./build/* root@51.15.242.162:/home/nmsilva/projects/protcapp/client