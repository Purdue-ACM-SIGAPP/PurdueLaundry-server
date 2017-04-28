# Purdue Laundry API

This is a backend for the Purdue Laundry application. It scrapes 
data from the Purdue Laundry alert page and provides a nice API 
for accessing it from the app. 

# Running the Server

Our server is Dockerized, so running it will require you to install
`docker` and `docker-compose`. Refer to the [docker documentation](https://docs.docker.com/compose/install/)
for instructions on how to do that. It's fairly well documented
and painless. If you are running Ubuntu, there are special
instructions. Ask @vidia for those instructions.

Once you have those 2 dependencies installed, you can build and run
the server with these 2 commands respectively:  

    $ docker-compose build
    $ docker-compose up

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