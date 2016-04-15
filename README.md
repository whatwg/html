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

Use a column width of 100 characters.

Using newlines between "inline" element tag names and their content is forbidden. (This actually alters the content, by adding spaces.) That is
```html
<a>token</a>
```
is fine and
```html
<a>token
</a>
```
is not.

Using newlines between attributes and inside attribute values that contain whitespace is allowed.
Always wrap after putting the maximum number of characters on a single line within these guidelines.

An `<li>` element always has a `<p>` element inside it, unless it's a child of `<ul class="brief">`.

If a "block" element contains a single "block" element, do not put it on a newline.

Do not indent for anything except a new "block" element. For instance
```html
 <li><p>Set <var>response</var>'s <span title=concept-response-url-list>url list</span> to a copy of
 <var>request</var>'s <span title=concept-request-url-list>url list</span>.
```
is not indented, but
```html
 <li>
  <p>Run these substeps <span data-anolis-spec=html>in parallel</span>:

  <ol>
```
is.

End tags must not be omitted and attribute values must be quoted (use double quotes).

### Tests

Tests can be found in the `html/` directory of the [web-platform-tests repository](https://github.com/w3c/web-platform-tests).
