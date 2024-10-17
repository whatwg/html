# HTML Standard contributor guidelines

These are the guidelines for contributing to the HTML Standard. First see the [WHATWG contributor guidelines](https://github.com/whatwg/meta/blob/main/CONTRIBUTING.md).

The HTML Standard is quite complex and people notice minor and larger issues with it all the time. We'd love your help fixing these. Pull requests for typographical and grammar errors are also most welcome.

We label [good first issues](https://github.com/whatwg/html/labels/good%20first%20issue) that you could help us fix, to get a taste for how to submit pull requests, how the build process works, and so on.

We'd be happy to mentor you through this process. If you're interested and need help getting started, leave a comment on the issue or bug, or [ask around](https://whatwg.org/chat). The [FAQ](FAQ.md) may also be helpful.

## Pull requests

In short, change `source` and submit your patch, with a [good commit message](https://github.com/erlang/otp/wiki/Writing-good-commit-messages). Try to follow the source formatting rules below.

Note that `source` is written in [Wattsi Syntax](https://github.com/whatwg/wattsi/blob/main/Syntax.md), a dialect of HTML, which is eventually compiled into the deployed standard by a tool called [Wattsi](https://github.com/whatwg/wattsi).

Please add your name to the Acknowledgments section (search for `<!-- ACKS`) in your first pull request, even for trivial fixes. The names are sorted lexicographically.

To preview your changes locally, follow the instructions in the [html-build repository](https://github.com/whatwg/html-build).

## The developer's edition

In addition to generating the [singlepage](https://html.spec.whatwg.org/) and [multipage](https://html.spec.whatwg.org/multipage/) specifications, we also generate an [edition for developers](https://html.spec.whatwg.org/dev/). This is meant to exclude content that is of interest only to implementers. We can always use community help in properly enforcing this distinction, especially since for a long period the developer's edition was not working and so we made a lot of changes without properly considering their impact on it.

To mark an element as being omitted from the developer's edition, use a `w-nodev` attribute. To only include it in the developer's edition, use a `w-dev` attribute. This may require introducing container `<div>`s or `<span>`s; that's fine. Note that Web IDL blocks (`<pre class="idl">`) are automatically omitted by the build process, and so don't need `w-nodev` attributes. (There also exist `w-nohtml`, `w-nosnap`, and `w-noreview` attributes which exclude information from the Living Standard, the Commit Snapshot, and the Review Draft respectively. Day-to-day changes will not require them.)

Another interesting feature is the `subdfn` attribute. This is useful for when something is defined inside text that is not present in the developer's edition (such as a Web IDL block). In that case, we can use the `subdfn` attribute on something which has a matching `data-x` attribute, to indicate the definition of the term for the purposes of the developer's edition.

In general we want to omit from the developer's edition:

* Any Web IDL; instead, the `<dl class="domintro">` descriptions suffice.
* The definitions of IDL attributes and operations as algorithmic steps (ditto).
* Other instructions for user agents on how to implement a feature.
* Definitions of low-level concepts and terms that do not impact web development.

On the other hand, we want to especially keep:

* High-level descriptions and introductions.
* Authoring instructions.
* Examples.
* Helpful notes about common situations.

In between these clear-cut categories, there is some gray area. Please feel free to open an issue if you think something is being included that shouldn't be, or is being excluded but should be kept.

## Style guide

The HTML Standard generally follows style conventions listed in the [Infra Standard](https://infra.spec.whatwg.org) and the [WHATWG style guide](https://whatwg.org/style-guide). Additionally, the HTML Standard follows some specific style conventions not captured by those documents, that we enumerate below.

Due to the long legacy of the existing text, these guidelines are not always applied. We do require that you apply the guidelines when making changes, though we are happy to provide assistance if this proves to be a blocker to you.

### Source formatting


#### Line wrapping length

Use a column width of 100 characters and add newlines where whitespace is used. (Emacs, set `fill-column` to `100`; in Vim, set `textwidth` to `100`; and in Sublime, set `wrap_width` to `100`. Alternatively, wrap the paragraph(s) with your changes with https://domenic.github.io/rewrapper/. Make sure that `column length to rewrap` is set to 100.)

#### Wrapping opportunities

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

Using newlines between attributes and inside attribute values that contain whitespace is allowed. Always wrap after putting the maximum number of characters on a single line within these guidelines.

```html
  <p>A <code>base</code> element that is the first <code>base</code> element with an <code
  data-x="attr-base-href">href</code> content attribute <span>in a document tree</span> has a
```

### Element hierarchy

An `<li>` element always has a `<p>` element inside it, unless it's a child of `<ul class="brief">`.

List items (`<li>`, `<dt>`, and `<dd>`) always start on their own line with a newline between them
and the previous list item. No extra newline at the start or end of the list though:
```html
 <ol>
  <li><p>Let <var>x</var> be 1.</p></li>

  <li><p>Increment <var>x</var> by 2.</p></li>
 </ol>
```

If a "block" element contains a single "block" element, do not put it on a new line.

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

### Common mistakes around prose style

Most of the style conventions in this section are covered by Infra or the WHATWG style guide, but the editors often have to correct them in contributions anyway.

 - Use the [algorithm declaration conventions](https://infra.spec.whatwg.org/#algorithm-declaration) in the Infra Standard.
 - **"If foo, then bar"** instead of "If foo, bar". [Example](https://github.com/whatwg/html/pull/10269#discussion_r1568114777).
 - **"Abort these steps" vs "return"**: Use "return" to exit a whole algorithm or method. Use "abort these steps" to terminate a set of substeps or [in parallel](https://html.spec.whatwg.org/C#in-parallel) steps and continue at the next step in the "outer" procedure. See examples in [this section on parallelism](https://html.spec.whatwg.org/C#parallelism) and elsewhere throughout the spec, as well as https://github.com/whatwg/infra/issues/258.
 - **Usage of positional, optional, and named[^1] (i.e., linkable) parameters**. Follow the [algorithm parameter conventions](https://infra.spec.whatwg.org/#algorithm-params) in the Infra Standard. In particular, use named/linkable optional parameters in your algorithm declaration when callsites pass in values for them while omitting earlier-positioned optional parameters.
 - When **nesting 3+ conditions** in a list, the style should look like so:
   ```html
     <li><p>Foo.</p></li>

     <li>
      <p>If (all|any) of the following are true:</p>
      
      <ul class="brief">
       <li><p>condition 1;</p></li>

       <li><p>condition 2;</p></li>

       <li><p>condition 3; (and|or)</p></li>

       <li><p>condition 4,</p></li>
      </ul>

      <p>then…</p>
     </li>
     
     <li><p>Baz.</p></li>
   ```
 - **Conjugate algorithm invocations inline** so they read more naturally in English, instead of more procedurally. For [example](https://github.com/whatwg/html/pull/9778#discussion_r1574075112), use `the result of <span data-x="get the popcorn">getting the popcorn</span>` instead of `the result of running <span>get the popcorn</span>`.
 - Prefer American English to British English; see the [WHATWG style guide](https://whatwg.org/style-guide).

[^1]: For example, see parameters like https://html.spec.whatwg.org/C#navigation-referrer-policy, which are named/linkable parameters in an algorithm's declaration.
