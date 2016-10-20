# HTML Standard Team Instructions

This document contains info used by the team maintaining the standard. Mostly boring infrastructure stuff.

## Handling pull requests

Each change needs to result in a single commit on the master branch, with no merge commits. The green squash and merge button is OK to use, but be sure to tidy up the commit message per [guidelines for writing good commit messages](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

For normative changes, ask for a [web-platform-tests](https://github.com/w3c/web-platform-tests) PR if testing is practical and not overly burdensome. Aim to merge both PRs at the same time. If one PR is approved but the other needs more work, add the `do not merge yet` label.

If a follow-up issue is filed, add the `html` label.

### Fetching and reviewing pull requests from forks

Pull requests from external contributors come from their forks. To be able to more easily review the commits in those pull requests, you can optionally configure your clone such that:

* Alongside the remote branches you already have [created by the team](https://github.com/whatwg/html/branches), you'll also have remote branches for all existing PRs.
* Thus you can `git checkout` any PR branch you want to build/review, and use `git pull` to pull any updates to it.

To do all that, use these steps:

1. Do one of the following:
   * Run the following command to **globally configure, for all repositories you pull from**, automatic fetch of branches for PRs from forks:

     ```bash
     git config --global --add remote.origin.fetch "+refs/pull/*/head:refs/remotes/origin/pr/*"
     ```
     That will add the following two lines to your `$HOME/.gitconfig` file:

     ```
     [remote "origin"]
             fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
     ```

     If you change your mind later about globally enabling that behavior, you can disable it by removing those lines.

    * Alternatively, to enable automatic fetch of branches in PRs from forks **just for this repo**, omit `--global` from the above command.

2. Run `git fetch` or `git pull` to do the initial fetch of all branches for current PRs.

3. Run `git checkout pr/NNN` to check out a particular PR branch. For review purposes, you may want to subsequently do `git rebase master` to make sure it is on top of the latest changes from `master`.

4. If a contributor subsequently pushes changes to the corresponding branch for that PR in their fork (for example, in response to your review comments), then: make sure you're on the checked-out `pr/NNN` branch locally, and reset to the latest from the remote, by doing the following:

   ```bash
   git checkout pr/NNN
   git fetch
   git reset --hard origin/pr/NNN
   ```

### Merging pull requests from forks

Just use the normal green button (labeled **Merge pull request**) in the pull-request page in the GitHub Web UI. After you press that, another green button will appear, labeled **Confirm squash and merge**. Ensure that the commit message follows [the guidelines](https://github.com/erlang/otp/wiki/Writing-good-commit-messages), then press that and all the commits from that PR branch will be combined into one commit to the master branch.

Otherwise, if you want to merge a PR from the command line, you can, once you have completed the **Fetching and reviewing pull requests from forks** setup (above), by doing the following:

```bash
git checkout pr/NNN
git rebase master
... build and review the spec ...
git checkout master
git merge pr/NNN --ff-only
```

This checks out the PR's commits, rebases them on `master`, then fast-forwards `master` to include them.

Before pushing, you should amend the commit message with a final line containing `PR: https://github.com/whatwg/html/pull/XYZ`, so that we can easily see a link back to the pull request's discussion. Finally, you can do `git push origin master` to push the changes. Don't forget to comment on the pull request with something like "Merged as 123deadb33f" before closing.

### Merging pull requests from branches

Pull requests from other editors or members of the WHATWG GitHub organization may come from branches within this repository.

Just as with PRs from forks, you can merge PRs from branches in this repo to the master branch just using the normal green button (labeled **Merge pull request**) in the pull-request page in the GitHub Web UI. After you press that, another green button will appear, labeled **Confirm squash and merge**. Press that and all the commits from that PR branch will be combined into one commit to the master branch.

Otherwise, if you want to cleanly merge a PR from a branch within the repo using the command line, you need to add an extra step in addition to the steps you'd follow for merging a PR from a fork. These are the steps:

```bash
git checkout BRANCH_NAME
git rebase master
... build and review the spec ...
git push --force
git checkout master
git merge BRANCH_NAME --ff-only
```

The additional `git push --force` line here ensures that the original branch gets updated to sit on top of `master` as well. This ensures GitHub can automatically figure out that the commits were merged, and thus automatically close the pull request with a nice purple "merged" status. So at this point you can do a `git push origin master` to push the changes, and GitHub will close the PR and mark it as merged.

## Bugs

There are three sources of bugs we should be managing:

- [This repository's GitHub issue tracker](https://github.com/whatwg/html/issues)
- [The remaining bugs from the W3C's WHATWG/HTML Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=HTML&list_id=59457&product=WHATWG&query_format=advanced&resolution=---)
- [Some bugs from the W3C's HTML WG/HTML5 spec Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&bug_status=RESOLVED&bug_status=VERIFIED&bug_status=CLOSED&component=HTML5%20spec&list_id=64339&longdesc=Bugzilla%20Bug%20Triage&longdesc_type=substring&product=HTML%20WG&query_format=advanced&resolution=---&resolution=FIXED&resolution=NEEDSINFO&resolution=INVALID&resolution=WONTFIX&resolution=LATER&resolution=REMIND&resolution=DUPLICATE&resolution=WORKSFORME&resolution=MOVED&status_whiteboard=whatwg-resolved&status_whiteboard_type=notregexp)

### Handling bugs in W3C Bugzilla

Bugs in the WHATWG/HTML component should be RESOLVED MOVED when we create a GitHub issue or a pull request for it, while adding a comment linking to the new issue or pull request URL.

Some bugs that are not filed in that component might still be relevant for us; these are mostly captured by the above search, although it's possible there are other components where people are filing relevant bugs. When we fix such bugs, or if you notice such a bug that is already fixed or doesn't apply, add `whatwg-resolved` to the bug's whiteboard field, which will ensure that it disappears from the above search and does not show up in the margin of the generated spec.
