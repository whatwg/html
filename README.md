This repository hosts the [HTML Standard](https://html.spec.whatwg.org/).

### Code of conduct

We are committed to providing a friendly, safe and welcoming environment for all. Please read and respect the [WHATWG Code of Conduct](https://wiki.whatwg.org/wiki/Code_of_Conduct).

### Contribution opportunities

The HTML Standard is quite complex and people notice minor and larger issues with it all the time. We'd love your help fixing these. Pull requests for typographical and grammar errors are also most welcome.

We label [good first bugs](https://github.com/whatwg/html/labels/good%20first%20bug) that you could help us fix, to get a taste for how to submit pull requests, how the build process works, and so on.

We'd be happy to mentor you through this process. If you're interested and need help getting started, leave a comment on the issue or bug, or ask around [on IRC](https://wiki.whatwg.org/wiki/IRC).

### Pull requests

In short, change `source` and submit your patch, with a [good commit message](https://github.com/erlang/otp/wiki/Writing-good-commit-messages). Consider reading through the [WHATWG FAQ](https://wiki.whatwg.org/wiki/FAQ) if you are new here.

Please add your name to the Acknowledgements section (search for `<!-- ACKS`) in your first pull request, even for trivial fixes. The names are sorted lexicographically.

To preview your changes locally, follow the instructions in the [html-build repository](https://github.com/whatwg/html-build).

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

### Tests

Tests can be found in the `html/` directory of the [web-platform-tests repository](https://github.com/w3c/web-platform-tests).
