/* eslint-env jasmine */
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

// Remove default reporter logs
jasmine.getEnv().clearReporters();

// Add the reporter we want
jasmine.getEnv().addReporter(new SpecReporter({
	spec: {
		displayPending: true
	}
}));