This repository hosts the [HTML Standard](https://html.spec.whatwg.org/).

### Code of conduct

We are committed to providing a friendly, safe and welcoming environment for all. Please read and respect the [WHATWG Code of Conduct](https://wiki.whatwg.org/wiki/Code_of_Conduct).

### Contribution opportunities

The HTML Standard is quite complex and people notice minor and larger issues with it all the time. We'd love your help fixing these. Pull requests for typographical and grammar errors are also most welcome.

We label [good first bugs](https://github.com/whatwg/html/labels/good%20first%20bug) that you could help us fix, to get a taste for how to submit pull requests, how the build process works, and so on.

We'd be happy to mentor you through this process. If you're interested and need help getting started, leave a comment on the issue or bug, or ask around [on IRC](https://wiki.whatwg.org/wiki/IRC).

### Pull requests

The short version is that all you need to do is change the `source` resource and submit a patch. The longer version is that you probably want to read the [WHATWG FAQ](https://wiki.whatwg.org/wiki/FAQ) first.

Please also add your name to the Acknowledgements section (search for `<!-- ACKS`) in your first pull request, even for simple typo fixes. The names are sorted alphabetically.

To preview your changes locally, follow the instructions in the [html-build repository](https://github.com/whatwg/html-build).

The source for the spec is formatted in such a way that its paragraphs have line breaks after about every 100 characters or so. Any patch you contribute must follow that same formatting convention. So, use whatever option your text editor may provide for automatically doing that kind of "hard" wrapping of lines at 100 characters; for example, in Emacs, set `fill-column` to `100`; in Vim, set `textwidth` to `100`; and in Sublime, set `wrap_width` to `100`.

Please follow the [guidelines for writing good commit messages](https://github.com/erlang/otp/wiki/Writing-good-commit-messages).

### Tests

Tests can be found in the `html/` directory of the [web-platform-tests repository](https://github.com/w3c/web-platform-tests).
