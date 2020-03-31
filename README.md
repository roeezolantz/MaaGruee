## Prerequisites
Tested on :
* npm >= 6.12
* node >= 13.1
* API that matches the schema explained below

## API Endpoints Examples
`/data` should return something like this 
`/tradeoffs?network=<network_name>&sensor=<sensor_name>`should return something like this
`/janitorBlacklist` should return something like this

## !IMPORTANT - Client Environment Configurations
1. All configurations should start with the `REACT_APP_` prefix in order to be loaded
2. All configurations should be written in a `.env` file in order to be loaded
3. All boolean default values are true !

`REACT_APP_API_ADDRESS` (url ex. http://localhost:8080) - The address of the api server
`REACT_APP_READ_ONLY` (boolean) - If set to false, the use will not be able to do any changes and save them
`REACT_APP_ENFORCE_PATH_CASING` (boolean) - If set to false, casing will not be enforced in the path input box
`REACT_APP_ALLOW_UNSAVED_CONFIGURATIONS_HISTORY` (boolean) - If the system should keep unsaved configurations
`REACT_APP_SIZE_RATIO_TO_KB` (number, default is 1) - The ratio between the sizes served by the api to 1 kb

**Changing the next configurations may cause problems**

`REACT_APP_GENERATE_COLORS` (boolean) - If set to false, the data api should contain hex colors for the sunburst **dont change this to false unless you really understand how you should handle colors creation in the api**
`REACT_APP_VALIDATE_SCHEMA` (boolean) - If set to false, the data fetched from the api will not be verified **may cause errors**
`NODE_PATH='src/'` - This is a nice tweak to shorten root imports, you dont have to change this

## Available Scripts

In the project directory, you can run:

### `npm run start-mock-server`

Runs a mock express server on http://localhost:8080.

### `npm start`

Runs the client app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
**Read create-react-app eject for more information before doing this!** 

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
