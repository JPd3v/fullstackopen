The backend would be developed in python.
-we would use Pylama as a linter wich is a code audit tool composed of a large number of linters such and other tools for analyzing code. It combines the following
.pycodestyle (formerly pep8)
.pydocstyle (formerly pep257)
.PyFlakes
.Mccabe
.Pylint
.Radon
.gjslint
-We would use Pytest as a testing tool for writing our units test and integration tests.
-Python is an interpreted language so it doesn't need a build step.

-Some ci/cd alternatives to jenskins / github actions can be : Travis CI, GitLab, CircleCI, TeamCity, Bamboo, Buddy, Codeship, GoCD, Wercker, Semaphore.

-in this case cloud-based environment would be the best option because is a small / medium project with only 6 people. They don't need to waste time that could be used developing the actual product in setting up a system in a self-hosted environment
and also because the project isnt a big enought probably it would be cheaper.
