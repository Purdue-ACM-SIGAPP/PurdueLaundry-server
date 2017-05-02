#! /bin/bash

help="\
Usage: ./make.sh [<options>]
Makes and deploys documentation.

Options:
  -h, --help    Show this help information.
  -l, --local    Only build locally and start a local server
"

# Args
for arg in $@
do
	if [["$arg" = "-h" || "$arg" = "--help"]]; then
		echo "$help"
	fi

	if [["$arg" = "-l" || "$arg" = "--local"]]; then
		LOCAL=true
	else
		LOCAL=false
	fi
done

# Install Gems
cd slate-src
bundle install

# Build
bundle exec middleman build --clean

# Local Server
if [[ $LOCAL = true ]]
	bundle exec middleman server
fi

# Deploy
if [[ $LOCAL = false ]]
	cp build/* .
	git add -A
	git commit -m "Updated documentation"
	git push origin master
fi