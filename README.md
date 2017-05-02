# Purdue Laundry API

This is a backend for the Purdue Laundry application. It scrapes 
data from the Purdue Laundry alert page and provides a nice API 
for accessing it from the app. 

# Running the Server with Docker

Our server is Dockerized, so running it will require you to install
`docker` and `docker-compose`. Refer to the [docker documentation](https://docs.docker.com/compose/install/)
for instructions on how to do that. It's fairly well documented
and painless. 

Once you have those 2 dependencies installed, you can build and run
the server by simply running:

    $ npm start
    
**If you are running Ubuntu:** there are special instructions that
you need to install Docker. Ask @vidia for those instructions.
    
# Running the Server without Docker

That said, it is possible to run the server *without* using Docker;
it's just more difficult since you'll have to worry about dependencies. 

First, do the following:
- Install a version of Node.js that supports `async`/`await`
	- If you have an older version already installed, I suggest
	moving to `nvm` (Node Version Manager). It makes using
	different versions of Node easy, and the version
	on `apt-get` is out of date anyway.
- Run `npm i --production` (This installs every non-dev dependency)
- Run `sudo npm i -g pm2` (We use pm2 to run our server)

Once those things are installed, just run:

    $ npm run start-vanilla
    
***Important:*** This method of running the server will not be
supported. There are a lot of dependencies for this project
and they could all be affected by other parts of your machine,
making this use case very difficult to debug. We will try our best
to keep this list of dependencies accurate to our `Dockerfile`,
but if this does not work, you're going to have to try to fix it
yourself or just install Docker. Sorry.

# Testing

To run all tests, simply run:

    $ npm test

A summary of the tests will be displayed in `stdout`. 

To write new tests, refer to the [Jasmine documentation](https://jasmine.github.io/edge/node.html).
Additionally, testing involves linting the code according to the
standards in `.eslintrc.json`, so make sure your code is well
formatted to pass all the tests.

The Jasmine tests are relatively well organized. `test/data` should
hold any mock data that you want to pass into your functions.
`test/helpers` holds any custom matchers that your tests will need.
There should be 1 matcher for every class in the `server/classes`
folder. 

Finally, `test/cases` holds the actual test cases. There
is 1 file for every folder in `server`, and in each file, Jasmine
makes it easy to further `describe` one suite for each file in that
folder. Furthermore, you should `describe` multiple situations for
each file, then use `it` to write 1 or many tests for each situation.

I know that was very confusing, and I very am sorry. It will likely
make more sense when you look at the files and run them to see 
what they output.

# Deploying

Deploying is currently managed by SigApp officers and hosted on
an AWS ECS instance. Deployments will happen periodically in 
line with changes to the Android app. 

# License

This API is licensed under GPLv3 and can be viewed in `LICENSE`.