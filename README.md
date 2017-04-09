# refactor_frrapp

## Setup
Install NodeJS to get NPM (https://nodejs.org/en/download/)

Open a console

Cd into project root. All consoles should be at project root (/pubapp)

Install project dependencies with npm install

In one console, type gulp sparrest to run the backend API that will serve dynamic

Install gulp globally with npm install -g gulp

Content (comments)

Go to www and drag-and-drop index.html into your browser. It will run from there.

## Project structure
* pubapp/
* mock_backend/
* www/
* gulpfile.js
* ns-config.json
* package.json
* README.md

#### Description of these folders and files:
=======



Project structure
pubapp/

    mock_end -- contains sample data for sparrest mock backend
    
    www -- contains all files relevant to the frontend
    
    gulpfile.js -- contains tasks to run static server (to serve files)
    and API server (to serve dynamic content from SPARREST)
    
    ns-config.json -- SPARREST server configuratin file
    
    package.json -- contains dependencies for project
    
    README.md -- instructions to set up project
