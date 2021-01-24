# All Your Stuff In One Place

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

You can clone the project by running
### `git clone https://github.com/matticoli/aysiop.git`

*NOTE: Running this app requires unchecked credentials files for the server and client. (Development access to Google Cloud is required in order to download using the links below. Contact Mikel for more info)*
- [Server credentials](https://storage.cloud.google.com/aysiop_cloudbuild/server-creds-dev.json): rename to `server-creds.json` and place in project `server/` 
- [Client credentials](https://storage.cloud.google.com/aysiop_cloudbuild/client-creds-dev.json): rename to `client-creds.json` and place in `client/` 

**To run dev server using Docker:**
```
docker-compose up
```

**To run dev server using npm:**
```
npm install
npm run dev
```
#

## Available Scripts


In the project directory, you can run:

### `npm install`
Installs all dependencies

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page should reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm start`

Runs app in production mode. This will serve the content in the `build` folder (must build first). To apply code changes, rebuild.

#

## Packaging
This project utilizes two bundling systems to minimize the bundle size being pushed to GCP:
- [Backpack by jaredpalmer](https://github.com/jaredpalmer/backpack) is used to bundle and minify server code in production builds. This allows the server to run with a few files containing only active code, as opposed to using `node_modules/`, which causes issues with App Engine's file cap.

- [Parcel](https://github.com/parcel-bundler/parcel) is used for client-side bundling for local dev and production. In dev, the parcel watcher transpiles the contents of `client/` faster than a react dev server. In prod, an optimized bundle is built and outputted to the same `dist` directory, so dev and prod servers serve client code the same way.

## Workflow
- Tasks are tracked via issues - if you come across a bug or would like to request a feature, please submit it in the [issues tab](https://github.com/matticoli/aysiop/issues)

#

## Production Environment

### Google Cloud Platform
This application is hosted on Google Cloud Platform and Firebase. Permissioned users can deploy, troubleshoot, and otherwise manage production services at [https://console.cloud.google.com/home/dashboard?project=aysiop](https://console.cloud.google.com/home/dashboard?project=aysiop)

### Firebase
Authentication is handled by firebase, and can be managed via the Firebase console at [https://console.firebase.google.com/u/0/project/aysiop/](https://console.firebase.google.com/u/0/project/aysiop/)

### **Automatic Deployment**

All commits to the `master` branch are auto-deployed to the [production environment](https://aysiop.appspot.com) on GCP's App Engine. This is the correct workflow for regular releases.

### **Manual Deployment**

Authenticated users with the Google Cloud SDK installed can run
`gcloud builds submit --config cloudbuild.yaml .`
#

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
