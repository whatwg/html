# HTML Standard Team Instructions

This document contains info used by the team maintaining the standard. Mostly boring infrastructure stuff.

## Handling pull requests

Each change needs to result in a single commit on the master branch, with no merge commits. The green squash and merge button is OK to use, but be sure to tidy up the commit message per [guidelines for writing good commit messages](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

For normative changes, ask for a [web-platform-tests](https://github.com/w3c/web-platform-tests) PR if testing is practical and not overly burdensome. Aim to merge both PRs at the same time. If one PR is approved but the other needs more work, add the `do not merge yet` label.

If a follow-up issue is filed, add the `html` label.

### Checking out pull requests from forks

Pull requests from external contributors come from branches in their forks. You can check out those external branches in order to review and test the commits in those pull requests, and to be able to push changes to them on your own (e.g., fixes for typos)—rather than needing to write review comments asking the PR contributor to make the edits.

For checking out a PR branch, use one of the following options:

* Option 1: Use the [checkout-pr](./checkout-pr) script
* Option 2: Use the [hub checkout *PULLREQ-URL*](https://hub.github.com/hub.1.html) command
* Option 3: Use standard git commands to check out a PR branch

The options are explained in detail below. Regardless of which option you use, it's recommended that you also make the following change to your `git` configuration:

```bash
git config push.default upstream
```

If you make that change, then whenever you're in a local PR branch and want to push changes back to the corresponding external branches, you can just run `git push` with no arguments (rather than also needing to specify the remote name and branch name as arguments). Otherwise, you need to also specify the remote name and branch name each time you push.

If you want to enable that same ability for all your project clones, also specify the `--global` option: `git config --global push.default upstream`.

#### Option 1: Use the checkout-pr script

You can check out a PR branch by running the `checkout-pr` script in the root directory of your `html` repository clone:

**Example using just a PR number**
```bash
./checkout-pr 1871
```
**Example using a PR URL**
```bash
./checkout-pr https://github.com/whatwg/html/pull/1871
```

You should see output similar to this:

```bash
Getting data for whatwg/html PR #1871...

Author: estark37 (Emily Stark)
Title:  Honor srcdoc document referrer policies when set

Preparing for checkout into 'estark37-srcdoc-meta-referrer-policy' local branch.
Adding new remote 'estark37'.
Fetching 'srcdoc-meta-referrer-policy' branch from remote 'estark37'.
Checking out into 'estark37-srcdoc-meta-referrer-policy' local branch.
Switched to a new branch 'estark37-srcdoc-meta-referrer-policy'
Branch estark37-srcdoc-meta-referrer-policy set up to track remote branch srcdoc-meta-referrer-policy from estark37.
```

#### Option 2: Use the "hub checkout *PULLREQ-URL*" command

[hub](https://hub.github.com/) is a specialized GitHub-aware command-line wrapper for `git`, "with extra features and commands that make working with GitHub easier".

There are `hub` install packages for most OS distros; for example, on MacOS you can install it with `brew install hub`. Or if you have an existing [`go`](https://golang.org/) environment, you can install `hub` with `go get github.com/github/hub`. Alternatively, you can download a [precompiled hub binary](https://github.com/github/hub/releases) and install it yourself anywhere in your `PATH`.

If you want to use `hub` for checking out PR branches, it's recommended that you to make the following change to your `git` configuration:

```bash
git config url.git@github.com:.pushInsteadOf git://github.com/
```

That's necessary because of a current shortcoming in `hub`: It has to do with the fact that GitHub remotes with git-protocol URLs are *read-only* (you can't push to them), while GitHub remotes with SSH (`git@github.com:*`) URLs are *read-write* (you can push to them). But when `hub` creates a PR branch, it adds the remote for that branch using a git-protocol URL instead of an SSH URL.

So the config change above fixes that problem by causing the URLs for remotes which get added to your config for your PR branches to be rewritten with `git@github.com:` in place of `git://github.com/`. That ensures you can actually push to them.

You can check out a PR branch using the command `hub checkout` followed by a PR URL:

**Example**
```bash
hub checkout https://github.com/whatwg/html/pull/1871
```

You should see output similar to this:

```bash
Updating estark37
From git://github.com/estark37/html
 * [new branch]      srcdoc-meta-referrer-policy -> estark37/srcdoc-meta-referrer-policy
Branch estark37-srcdoc-meta-referrer-policy set up to track remote branch srcdoc-meta-referrer-policy from estark37.
Switched to a new branch 'estark37-srcdoc-meta-referrer-policy'
```

#### Option 3: Use standard git commands to check out a PR branch

Behind the scenes, the `checkout-pr` script and `hub checkout *PULLREQ-URL*` both invoke the same sequence of underlying `git` commands. So you can achieve the same result by running the commands manually directly.

To get started, you first need to look at the GitHub Web for the PR with the changes you want to check out. At the end of all the comments you'll find a line in the following form:

> Add more commits by pushing to the *BRANCHNAME* branch on *AUTHOR*/html.

Take those *BRANCHNAME* and *AUTHOR* values and run the following sequence of commands:

1. If you don't already have a remote named *AUTHOR* configured (to check, see the output of `git remote -v` or look in your `html/.git/config` file), then run:

   ```bash
   git remote add --no-tags -t BRANCHNAME AUTHOR git@github.com:*AUTHOR*/html.git
   ```

   That command will create a new remote named *AUTHOR* in your clone, set to track the branch named *BRANCHNAME*.

2. If you do already have a remote named *AUTHOR* configured, then instead of `git remote add`, run:

   ```bash
   git remote set-branches --add AUTHOR BRANCHNAME
   ```

   That command will add tracking for the branch named *BRANCHNAME* to your existing *AUTHOR* remote.

3. To fetch the branch *BRANCHNAME* from `git@github.com:*AUTHOR*/html.git`, run:

   ```bash
   git fetch AUTHOR +refs/heads/BRANCHNAME:refs/remotes/AUTHOR/BRANCHNAME
   ```

4. Finally, create a local branch in your clone and set it track the corresponding branch from the *AUTHOR* remote:

   ```bash
   git checkout -b AUTHOR-BRANCHNAME --track AUTHOR/BRANCHNAME
   ```

   **Important:** Note that as above you should name the local branch *AUTHOR*-*BRANCHNAME* (that is, with the prefix "*AUTHOR*-"), not just *BRANCHNAME*. That naming strategy both avoids possible naming collisions if you have multiple remotes with branches of the same name, as well as clearly indicating to you which author/remote the branch is from.

**Example**
In https://github.com/whatwg/html/pull/1871 you'll see the following line:

> Add more commits by pushing to the **srcdoc-meta-referrer-policy** branch on **estark37/html**.

So you can check out that branch using the following sequence of commands:

```bash
git remote add --no-tags -t srcdoc-meta-referrer-policy estark37 git@github.com:estark37/html.git
git fetch estark37 +refs/heads/srcdoc-meta-referrer-policy:refs/remotes/estark37/srcdoc-meta-referrer-policy
git checkout -b estark37-srcdoc-meta-referrer-policy --track estark37/srcdoc-meta-referrer-policy
```

That checks out the PR changes into a new local branch named `estark37-srcdoc-meta-referrer-policy` and switches you to that branch.

#### Pulling updates to PR branches from a fork

If a contributor or other editor subsequently pushes changes to the remote branch in the author's fork (for example, in response to your review comments), you can pull the changes in pretty much the same way you do for non-external branches: You first check out the *AUTHOR*-*BRANCHNAME* branch (where *AUTHOR*-*BRANCHNAME* is the local branch name), and the just run `git pull`:

**Example**
 ```bash
 git checkout estark37-srcdoc-meta-referrer-policy
 git pull
 ```

#### Pushing local commits made in PR branches

If you have `git config push.default upstream` configured, you can push the changes on your local branch for the PR back to contributor's external branch just by running `git push` with no arguments:

```bash
git push
```

If you do not have `git config push.default upstream` configured, you need to specify the remote name and branch name each time you push, in the following form:

<pre>
git push <i>AUTHOR</i> HEAD:<i>BRANCHNAME</i>
</pre>

Note that *BRANCHNAME* is the **remote** branch name, not your corresponding local branch name (which if you followed the steps above to check out the branch is instead in the form *AUTHOR*-*BRANCHNAME*).

**Example**
```bash
git push estark37 HEAD:srcdoc-meta-referrer-policy
```

### Merging pull requests into master

Just use the normal green button (labeled either **Squash and merge** or **Rebase and merge**) in the pull-request page in the GitHub Web UI, but first ensure the commit message follows [the guidelines](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

#### "Squash and merge" button

If you use the **Squash and merge** button, you can edit the commit message directly within the GitHub Web UI to make any changes needed to have it match [the guidelines](https://github.com/erlang/otp/wiki/Writing-good-commit-messages):

1. Press the **Squash and merge** button to have the GitHub Web UI show an input form with the commit message.
2. Edit the commit message as needed directly in the input form provided.
3. Press the **Confirm squash and merge** button to complete the merge to master.

#### "Rebase and merge" button

If you use the **Rebase and merge** version of the green button, you first need to complete the following steps locally:

1. Run `git rebase -i` to squash the commits into a single commit.
2. Edit the commit message as needed to make it follow [the guidelines](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).
3. Use `git push --force` to push the commit back to the contributor's external remote.
4. Press the **Rebase and merge** button in the GitHub Web UI and a **Confirm rebase and merge** button will appear.
5. Press the **Confirm rebase and merge** button to complete the merge to master.

#### Merging to master from the command line

Regardless of whether a pull request comes from a contributor (in which case the branch is from a different remote repository and you've already used the **Checking out pull requests from forks** steps above to fetch the branch) or from other editors or members of the WHATWG GitHub organization (in which case the branch is within this repository), the steps for cleanly merging it to master are the same:

```bash
git checkout BRANCH_NAME
git rebase master
... build and review the spec ...
git checkout master
git push --force
git merge BRANCH_NAME --ff-only
```

This checks out the PR's commits, rebases them on `master`, then fast-forwards `master` to include them.

The `git push --force` line here ensures that the original branch gets updated to sit on top of `master` as well. This ensures GitHub can automatically figure out that the commits were merged, and thus automatically close the pull request with a nice purple "merged" status. So at this point you can do a `git push origin master` to push the changes, and GitHub will close the PR and mark it as merged.

## Bugs

There are three sources of bugs we should be managing:

- [This repository's GitHub issue tracker](https://github.com/whatwg/html/issues)
- [The remaining bugs from the W3C's WHATWG/HTML Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=HTML&list_id=59457&product=WHATWG&query_format=advanced&resolution=---)
- [Some bugs from the W3C's HTML WG/HTML5 spec Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&bug_status=RESOLVED&bug_status=VERIFIED&bug_status=CLOSED&component=HTML5%20spec&list_id=64339&longdesc=Bugzilla%20Bug%20Triage&longdesc_type=substring&product=HTML%20WG&query_format=advanced&resolution=---&resolution=FIXED&resolution=NEEDSINFO&resolution=INVALID&resolution=WONTFIX&resolution=LATER&resolution=REMIND&resolution=DUPLICATE&resolution=WORKSFORME&resolution=MOVED&status_whiteboard=whatwg-resolved&status_whiteboard_type=notregexp)

### Handling bugs in W3C Bugzilla

Bugs in the WHATWG/HTML component should be RESOLVED MOVED when we create a GitHub issue or a pull request for it, while adding a comment linking to the new issue or pull request URL.

Some bugs that are not filed in that component might still be relevant for us; these are mostly captured by the above search, although it's possible there are other components where people are filing relevant bugs. When we fix such bugs, or if you notice such a bug that is already fixed or doesn't apply, add `whatwg-resolved` to the bug's whiteboard field, which will ensure that it disappears from the above search and does not show up in the margin of the generated spec.
