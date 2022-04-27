export REACT_APP_ENV=production
export REACT_APP_API_BASE_URL=https://dcspt-drivitup.ua.pt/protc/api
export PUBLIC_URL=/protc/app/

yarn build
scp -r ./build/* nmsilva90@dcspt-drivitup.ua.pt:/var/www/drivitup-web/pythonapp/protc_client