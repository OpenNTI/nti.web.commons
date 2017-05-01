.PHONY: bundle clean check test

REPORTS = reports
LIB = lib

all: node_modules bundle

node_modules: package.json
	@rm -rf node_modules
	@npm install

# test: node_modules clean check
test: node_modules clean
	@jest

check:
	@eslint --ext .js,.jsx ./src

clean:
	@rm -rf $(LIB)
	@rm -rf $(REPORTS)

bundle:
	@webpack --progress --cache --bail --hide-modules=true --display-chunks=false
	@rollup -c
