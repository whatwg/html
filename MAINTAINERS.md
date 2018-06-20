# HTML Standard maintainer guidelines

These are the guidelines for the team maintaining the HTML Standard. First see the [WHATWG maintainer guidelines](https://github.com/whatwg/meta/blob/master/MAINTAINERS.md).

## Bugs

There are three sources of bugs we should be managing:

- [This repository's GitHub issue tracker](https://github.com/whatwg/html/issues)
- [The remaining bugs from the W3C's WHATWG/HTML Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=HTML&list_id=59457&product=WHATWG&query_format=advanced&resolution=---)
- [Some bugs from the W3C's HTML WG/HTML5 spec Bugzilla component](https://www.w3.org/Bugs/Public/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&bug_status=RESOLVED&bug_status=VERIFIED&bug_status=CLOSED&component=HTML5%20spec&list_id=64339&longdesc=Bugzilla%20Bug%20Triage&longdesc_type=substring&product=HTML%20WG&query_format=advanced&resolution=---&resolution=FIXED&resolution=NEEDSINFO&resolution=INVALID&resolution=WONTFIX&resolution=LATER&resolution=REMIND&resolution=DUPLICATE&resolution=WORKSFORME&resolution=MOVED&status_whiteboard=whatwg-resolved&status_whiteboard_type=notregexp)

### Handling bugs in W3C Bugzilla

Bugs in the WHATWG/HTML component should be RESOLVED MOVED when we create a GitHub issue or a pull request for it, while adding a comment linking to the new issue or pull request URL.

Some bugs that are not filed in that component might still be relevant for us; these are mostly captured by the above search, although it's possible there are other components where people are filing relevant bugs. When we fix such bugs, or if you notice such a bug that is already fixed or doesn't apply, add `whatwg-resolved` to the bug's whiteboard field, which will ensure that it disappears from the above search and does not show up in the margin of the generated spec.
