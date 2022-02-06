# Friend Post Poject

A basic social media app.

## Deploying with Heroku

1. Create github repo

2. Add node version in package.json

    Get node version:

            $ node -v

    Put in package.json like so:

            "engines": {
              "node": "16.13.1"
            },

3. Create **Procfile** in root dir with no extension

    Put this in the file (its the start script):

        web: node ./bin/www

    Its not stictly necesary because heroku can get it from package.json but its best practice.

## TODO

1. Auto add new users to the friend Bot User. Do this in the signup route? Push the botId to the new users friends array.

2. A way to see all posts or a way to render an extra 10 or so with a click.  


## Extra features

1. User can change profile name.

2. Add / change profile pic url.

3. Add img urls for posts.

4. Upload files aswell as urls for images (Cloudinary service for image storage).

5. (Optional) Add facebook or google authentication, might need to signup for facebook though.

6. Realtime updates of posts, comments and requests (socket.io).

7. Private chat between users.

