beforeEach(function() {
	jasmine.addMatchers({
		toBeTheSameMachineAs: function () {
			return {
				compare: function(actual, expected) {
					return {
						pass: actual.name === expected.name &&
							actual.displayName === expected.displayName &&
							actual.type === expected.type &&
							actual.time === expected.time &&
							actual.status === expected.status
					};
				}
			};
		}
	});
});