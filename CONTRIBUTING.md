The HTML Standard is quite complex and people notice minor and larger issues with it all the time. We'd love your help fixing these. Pull requests for typographical and grammar errors are also most welcome.

We label [good first bugs](https://github.com/whatwg/html/labels/good%20first%20bug) that you could help us fix, to get a taste for how to submit pull requests, how the build process works, and so on.

We'd be happy to mentor you through this process. If you're interested and need help getting started, leave a comment on the issue or bug, or ask around [on IRC](https://wiki.whatwg.org/wiki/IRC). The [WHATWG FAQ](https://wiki.whatwg.org/wiki/FAQ) may also be helpful.

### Pull requests

In short, change `source` and submit your patch, with a [good commit message](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

Leave the **Allow edits from maintainers** option enabled to allow reviewers (the HTML Standard maintainers) to fix trivial issues directly on your branch rather than needing to write review comments asking you make the edits.  For more details, see [Improving collaboration with forks](https://github.com/blog/2247-improving-collaboration-with-forks) in the GitHub Blog.

Please add your name to the Acknowledgments section (search for `<!-- ACKS`) in your first pull request, even for trivial fixes. The names are sorted lexicographically.

To preview your changes locally, follow the instructions in the [html-build repository](https://github.com/whatwg/html-build).

#### Tests

For normative changes, a corresponding [web-platform-tests](https://github.com/w3c/web-platform-tests) PR is highly appreciated. The author and reviewer can be different from the HTML Standard PR. If current behavior is unclear, writing tests first can help inform the discussion. Typically, both PRs will be merged at the same time.

If testing is not practical, please explain why and if appropriate [file an issue](https://github.com/w3c/web-platform-tests/issues/new) to follow up later.

#### Investigation

Often in the course of discussing a potential change, spec bug, or browser bug, it's useful to investigate the behavior in question in a variety of rendering engines and provide data back to the discussion. The best way to do this is to host a small test case and report the results in various engines.

For simple cases (not involving multiple files), sites like [Live DOM Viewer](https://software.hixie.ch/utilities/js/live-dom-viewer/) or [JSBin](https://jsbin.com/) are recommended. For cases involving multiple files, you'll likely need to use your own hosting, for example using [GitHub Pages](https://pages.github.com/). Or you could skip straight to working on web-platform-tests, as discussed above.

Attempt to make your test cases produce clearly-differentiable results regarding the different outcomes you're investigating. You can then report the results back to the issue thread using the following Markdown syntax as a starting point:

```markdown
| Test case                               | EdgeHTML | Blink | Gecko | WebKit
|-----------------------------------------|----------|-------|-------|-------|
| Test case description 1                 |          |       |       |       |
| Test case description 2                 |          |       |       |       |
| Test case description 3                 |          |       |       |       |
```

If there are additional interesting engine variations you are testing, for example older versions or engines not in the list, feel free to add more columns. If you can't test certain engines, leave a question mark in that cell, and others on the thread can help fill them in.

For examples of this kind of investigation in action, see [issue #775](https://github.com/whatwg/html/issues/775#issuecomment-190796607) or [issue #1087](https://github.com/whatwg/html/issues/1087#issue-150128324).

#### Formatting

Use a column width of 100 characters and add newlines where whitespace is used. (Emacs, set `fill-column` to `100`; in Vim, set `textwidth` to `100`; and in Sublime, set `wrap_width` to `100`.)

Using newlines between "inline" element tag names and their content is forbidden. (This actually alters the content, by adding spaces.) That is,
```html
   <dd><span>Parse error</span>. Create a new DOCTYPE token. Set its <i data-x="force-quirks
   flag">force-quirks flag</i> to …
```
is fine and
```html
   <dd><span>Parse error</span>. Create a new DOCTYPE token. Set its <i data-x="force-quirks flag">
   force-quirks flag</i> to …
```
is not.

Using newlines between attributes and inside attribute values that contain whitespace is allowed.
Always wrap after putting the maximum number of characters on a single line within these guidelines.

An `<li>` element always has a `<p>` element inside it, unless it's a child of `<ul class="brief">`.

If a "block" element contains a single "block" element, do not put it on a newline.

Do not indent for anything except a new "block" element. For instance
```html
   <li><p>Let <var>corsAttributeState</var> be the current state of the element's <code
   data-x="attr-link-crossorigin">crossorigin</code> content attribute.</p></li>
```
is not indented, but
```html
      <li>
       <p>For each <var>element</var> in <var>candidate elements</var>, run the following
       substeps:</p>

       <ol>
```
is.

End tags must not be omitted (except where it is consistent to do so) and attribute values must be quoted (use double quotes).
