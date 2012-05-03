REPORTER = spec

test:
	@./node_modules/.bin/mocha \
	  --reporter $(REPORTER) \
          --ui exports


test-cov: lib-cov
	@EXPRESS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test
