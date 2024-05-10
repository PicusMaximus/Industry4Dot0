# Dobot Guide

## Publish to pi
1. Move DOBOT folder into the pi user folder
2. Follow the steps in service README file to start the DOBOT API automaticly on pi startup

## Setup project

### On Pi
1. Go into the project folder
2. sudo apt install python3 npm
3. pip3 install cherrypy ws4py pyserial jinja2 requests flask flask_swagger_ui --break-system-packages
4. Run the following code in the command line...

   ```bash
      cd ./static

      npm install
      npm run build
   ```

### Localy
1. Go into the project folder:

   ```bash
      cd ./path/to/project/src/DOBOT
   ```
2. Install the needed technolegies:
   #### Unix
   On Unix systems you can simply run following command:
   ```bash
      $ sudo apt install python3 npm
   ```

   ####
   On win you have to download python3 and npm manualy from their websites.

   Python3 -> [here](https://www.python.org/downloads/)!\
   Node & npm -> [here](https://nodejs.org/en)

3. Next we install the needed dependencies for the project
   #### Pyhton
      Run the following command to load all the python dependencies:
      ( This should work for unix and win the same )
      ```bash
         # pip3 is the python package manager
         # This loads all the dependecies via the txt file.
         $ pip3 install ./requirements.txt --break-system-packages
      ```
   #### Npm

      Now go to the following directory:

      ```bash
         # This directory gets served to the frontend
         $ cd ./static
      ```

      Install the dependencies here!
      ```bash
         # loads all dependecies from the package.json file
         $ npm install
      ```
4. Build the project
   #### Python
   To start the python services you have to run to seperate commands. The first will start the API-Server and the second will run the Socket-Server which will only listen to website interactions.\
      > [!NOTE]  
      > This will be executed in the DOBOT directory.
   ##### First
      ```bash
         $ python3 ./api.py
      ```
   ##### Second
      ```
         $ python3 ./DobotServer.py
      ```

   #### Frontend
   Generally the frontend will be run by the api.py, but certain parts of the frontend need some extra attention to work. We have to do two things if we wont to build or update it.
   ##### First
   The frontend uses a tool called esbuild to bundle JS Files. This allows us to use ESMs which lead to a more modular codebase. Additionally we can use it to minify or js code which should give or website a better performance. Esbuild does also support Typescript if we ever want to integrate it into the project.
   [!NOTE]  
   This needs to be executed in the static directory of the DOBOT project.
   ```bash
      $ npm run build
   ```

   #### Second
   The styles of the frontend of the dobot are mostly handled by Tailwind. To update or change styles you need to run the following command which leads taildwind to check and update the current styles.
   > [!NOTE]  
   > You can still write CSS the normal way!
   ```bash
      npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

