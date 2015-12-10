# HTML Standard Team Instructions

This document contains info used by the team maintaining the standard. Mostly boring infrastructure stuff.

## Handling pull requests

The green button shall not be pushed. Each change needs to result in a single commit on the master branch, with no merge commits.

For optimal merges, the following instructions may be helpful:

### Merging pull requests from forks

Pull requests from external contributors come from their forks. Here is a Bash function that you can add to your `.bash_profile` or similar that makes it easy to merge such PRs:

```bash
pr () {
  git fetch origin refs/pull/$1/head:refs/remotes/origin/pr/$1 --force
  git checkout -b pr/$1 origin/pr/$1
  git rebase master
  git checkout master
  git merge pr/$1 --ff-only
}

$ pr 123
```

It will pull down the PR into a local branch, using [the special refs GitHub provides](https://help.github.com/articles/checking-out-pull-requests-locally/). Then it will rebase the PR's commits on top of `master`, and do a fast-forward only merge into `master`. At that point you can do `git push origin master` to push the changes, and comment on the pull request with something like "Merged as 123deadb33f" before closing.

### Merging pull requests from branches

Pull requests from other editors or members of the WHATWG GitHub organization may come from branches within this repository. Here is a function that you can use to merge such PRs:

```bash
mypr () {
  git checkout $1
  git rebase master
  git push origin $1 --force
  git checkout master
  git merge $1 --ff-only
}

$ mypr branch-name
```

It will rebase the PR on top of `master`, then force-push it to the appropriate branch, thus updating the PR. Then it will do the fast-forward only merge into `master`. At this point you can do a `git push origin master` to push the changes, which will _automatically_ close the PR and mark it as merged, since you managed to update the commits contained there.

## Handling bugs in W3C Bugzilla

Bugs in the WHATWG product should be RESOLVED MOVED when there's an issue or a pull request for it, and a comment linking to it.

Some bugs that are not filed in the WHATWG product might still be relevant for us, and some of these show up in the spec itself in the margin. If the bug has already been fixed, or doesn't apply, add `whatwg-resolved` to the whiteboard to remove it from the generated spec.
