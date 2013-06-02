
TESTS = test/*.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =

install:
	@npm install

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
	  --reporter $(REPORTER) \
	  --timeout $(TIMEOUT) \
	  $(MOCHA_OPTS) \
	  $(TESTS)




test-all: test

.PHONY: test test-all





