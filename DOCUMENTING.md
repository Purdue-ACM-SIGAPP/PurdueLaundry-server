# Documentation

The documentation of our server is under `docs/`. It uses
[Slate](https://github.com/lord/slate). GitHub pages automatically
displays the documentation under [purdue-acm-sigapp.github.io/purduelaundry-server]().

# Adding Documentation

Our documentation is a flavor of Markdown. The source is under
`docs/source/index.html.md`. Open that file in your preferred editor.



# Building Documentation

The documentation is built using [Jekyll](https://jekyllrb.com). It
is a Ruby gem, so to build the documentation, you must have installed
Ruby and Jekyll. This is fairly well documented on Jekyll's website.

***Warning:*** The versions of Ruby that work with Jekyll do not
play well with Windows. If Windows is your development environment,
you may want to use a VM or Docker.

There is a fancy Bash script to deploy locally and to GitHub. To
use it, run:

    $ cd docs
    $ 
    $ # To deploy to GitHub
    $ ./make.sh
    $
    $ # To run a local server
    $ ./make.sh [-l, --local]
    $
    $ # For a help message
    $ ./make.sh [-h, --help]