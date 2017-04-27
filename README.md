# Purdue Laundry API

Backend for the Purdue Laundry application. It scrapes data from the Purdue Laundry alert page and provides a nice API for accessing it from the app. 

# Running the API

Any change to the code will likely require the following command. This requires having docker and docker-compose installed. Installation instructions for those tools will be added soon. 

`$ docker-compose build`

After building the code, the following will start the redis and docker containers necessary. 

`$ docker-compose up`


# Contributing

Anyone is free to contribute to this server. However attention should be paid to the PurdueLaundry Application for compatability with API changes. 

`master` represents the API as currently deployed to `laundry-api.sigapp.club`. Updates to this should mirror a redeploy of the server. Do not commit to master directly. Do not merge into master without approval. 

`dev` represents the current state of the server. Updates to `dev` should be relatively stable and tested.
 
 Please make sure all unit tests pass before submitting a PR. If you write new code, you are expected to write tests for your code.

# Issues

If you are insterested in contributing to this repo, please assign an issue to yourself to claim it. This is important so that we do not do double work, and so that we have a way of discussing changes in an open forum. 

# Testing

To run all tests, simply run:

    $ npm test

A summary of the tests will be displayed in `stdout`. 

To write new tests, refer to the [Jasmine documentation](https://jasmine.github.io/edge/node.html)

# Deploying

Deploying is currently managed by Sigapp officers and hosted on an AWS EC2 instance. Deployments will happen periodically in line with changes to the Android app. 

# License

This API is licensed under GPLv3. 