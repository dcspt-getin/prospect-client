# Require Nodejs v16

export REACT_APP_ENV=production
export REACT_APP_API_BASE_URL=https://dcspt-drivitup.ua.pt/housepref/api
export PUBLIC_URL=/housepref/app/

yarn build
scp -r ./build/* nmsilva90@dcspt-drivitup.ua.pt:/var/www/drivitup-web/pythonapp/housepref_client