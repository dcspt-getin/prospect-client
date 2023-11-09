# Prospect Client

## Client Requirements

- Nodejs v16

## Installation

To install execute:

```bash
yarn install
```

## Run Locally

To run locally, execute:

```bash
yarn start
```

## Deployment

Before building, define the following environment variables:

```bash
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://dcspt-drivitup.ua.pt/housepref/api
PUBLIC_URL=/housepref/app/
```

`REACT_APP_ENV` This variable indicates the environment in which the React application is running. In this case, it's set to "production," suggesting that the application is configured for a production environment.

`REACT_APP_API_BASE_URL` This variable specifies the base URL for the API that the React application communicates with. It's set to "https://dcspt-drivitup.ua.pt/housepref/api."

`PUBLIC_URL` This variable defines the public URL for the React application. It's set to "/housepref/app/," indicating the base URL path where the application is hosted publicly.

Build the app with:

```bash
yarn build
```

### Nginx Configuration

```
server {
  ...

  location /prospect/static {
    alias /var/www/html/drivitup_prospect_web/static/;
  }

  location /prospect {
    root /var/www/html/drivitup_prospect_web/;
    index index.html;
    try_files $uri $uri/ /index.html =404;
  }

  ...
}
```

### Caddy Configuration

```
example.com {
    ...

    handle_path /prospect/static/* {
        root * /var/www/getin_prospect_web/static/
        file_server
    }

    handle_path /prospect/* {
        try_files {path} /index.html
        root * /var/www/getin_prospect_web/
        file_server
    }

    ...
}

```
