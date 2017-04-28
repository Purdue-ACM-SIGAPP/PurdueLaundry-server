# Contributing
You want to contribute to our server? Thanks! We're a small team,
so we appreciate the help.

# Branches
- `master` represents the API as currently deployed to 
  `laundry-api.sigapp.club`. Updates to this should mirror a 
   redeploy of the server. Do not commit to master directly. Do not
   merge into master without approval. 
- `dev` represents the current state of the server. Updates to `dev`
  should be relatively stable and tested.
- Every other branch should be named after what feature it is trying
  to implement. This helps us know what everything is when going
  through the repo. It also helps to make sure you're not trying
  to submit a superman branch that tries to fix too many things at
  once. If all of those things are related, that's fine, but you
  probably won't have trouble naming it if that's the case.
 
# Guidelines
- Strive for backwards compatibility. If you need to make a breaking
  change, it needs to be discussed with the SigApp officers because
  this would require changes to the app as well. 
- Test, test, test! Please make sure all unit tests pass before
  submitting a PR. If you write new code, you are expected to write
  tests for your code.

# How To Contribute
So you've got this far, but how do you actually contribute to this
project? Well, first clone this repo. If you are not a member of
Purdue ACM SigApp, you will need to fork it before cloning it. 
Now, you have 1 of 2 options:

1. [Contribute your own features you want in the server](#contributing-original-features)
2. [Implement requests for features or fix bugs](#implementing-feature-requests-and-fixing-bugs)

# Contributing Original Features

At this point, you're free to start coding! You should follow the
current file structure, coding style, and paradigm to help keep
things consistent so it's easy to fix bugs and implement new 
features in the future for everyone else!

Don't forget to write tests! Unit tests are *super* important, so
your pull request will not be accepted without passing tests.

Once you're done writing your new feature, you can 
[skip the next section](#pull-requests) to read about the next 
step - submitting a pull request

# Implementing Feature Requests and Fixing Bugs

If you want to fix something listed under the Issues tab, this is
the section for you! First, read the section before this one about
original code. All of those guidelines still apply! We just have
a couple additional guidelines to follow if you are doing 
something that was already documented as needing done.

1. **Assign yourself to the issue.** We don't want people doing
double work on the repo, so claim the issue as yours, then go wild!
2. **Reference the issue when submitting a pull request**. I'm
   getting a little ahead of myself since pull requests are the
   next section, but GitHub does a lot of cool things automatically.
   If, for example, the issue you're fixing is #6, you can just 
   make a comment on the pull request that says "fixes #6", and
   that issue will automatically be closed when the pull request
   is approved! Cool, eh?

# Pull Requests

The time has come. You've spent hours writing code, fixing it,
fixing it again, and testing it. Now, you want us to use your
code in our server. You must submit what is commonly called a PR, 
or Pull Request.

First, ensure that you have pushed your code to GitHub, now you can
follow their instructions on how to actually initiate a PR. It's
pretty well documented. Now, 2 things must happen:

1. All tests must pass when automatically run on Travis
2. You must go through a code review by at least 2 people with
   push access.
   
Travis is a tool for what's called a Continuous Integration, 
commonly shortened to CI, and every time code is pushed to GitHub,
it runs a test suite, then, if the tests pass, it pushes the code
to production (Heroku, AWS, DigitalOcean, et cetera).

When you submit a pull request, Travis will automatically run tests,
and above the button to approve your PR (which should be disabled),
GitHub will tell you if Travis shows your tests as passing. Every
time you make another commit, the tests should run again, so the 
results will always be up to date.

The other thing you'll see above the Approve button is that your
code needs looked at and approved by 2 people that have push access
to the repository. No code is perfect, so commonly, we will look
at all of your changes, and submit comments on many lines asking
why you did what you did, suggestions on how to fix bugs you may
have introduced without realizing, or many other things.

Once we are satisfied with your code, we will approve it, and it
will be pushed into `dev`

# Congrats!

![leonardo "finally has an oscar" dicaprio](https://media.giphy.com/media/g9582DNuQppxC/giphy.gif)

You have now gone through the daunting task that is contributing
to a repository that you do not own. It can be hard! Now, you
should go treat yourself by binging the latest season of Silicon
Valley and chugging a Soylent. This is Computer Science, after
all!

![a pro hacker](https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif)