export REACT_APP_ENV=production
export REACT_APP_API_BASE_URL=https://dcspt-getin.ua.pt/prospect/api
export PUBLIC_URL=/prospect/

yarn build
scp -r ./build/* nmsilva90@dcspt-getin.ua.pt:/data/compose/10/data/drivitup_prospect_web