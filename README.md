## Clone this, reset the git url, and make an app

### Notes

Install `release-it` (`npm install release-it -g`) to make bumping versions real easy.

If `release-it` complains about your upstream repo, push once with the `-u` flag set
(`git push -u origin master`) to tell git that `origin/master` is to be the tracking branch
for the branch that you're currently pushing from. Yay git.

### TODO

* Sane dependency management
* Simple server to serve your app if need be
* Roll in Landon's cog generator
