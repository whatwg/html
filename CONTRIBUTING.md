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

### Algorithms

[The Infra Standard](https://infra.spec.whatwg.org/#algorithms) sets out the basics of algorithms, but the HTML spec goes way beyond that.

When contributing to HTML, we attempt to mark up algorithms and variable scopes. The main visible benefit of this is that it gives "var highlighting", where clicking on a `<var>` element highlights all other references to it. Behind the scenes, it also enables various static analysis checks. Do your best to follow the below guidelines when introducing new algorithms or modifying existing ones.

HTML's algorithm system is based on, and intended to be compatible with, [that of Bikeshed](https://speced.github.io/bikeshed/#var-and-algorithms) (a build tool often used for other specifications).

#### The markup

Each algorithm should be wrapped in `<div algorithm> ... </div>`. The contents of this `<div>` should not be indented.

The 'body' of an algorithm will normally be preceded by a 'preamble', some text that gives:

* the name of the algorithm, or some indication of how/when it is invoked;
* the names and/or types of any parameters; and
* maybe the type of the return value, if any.

Include this preamble within the `<div algorithm>`. Sometimes the preamble will be preceded by other stuff (not specific to the algorithm) in the same `<p>`. It's generally okay to include the other stuff within the `<div>`, but consider splitting it off into its own `<p>`, so that the `<div>` can be focused on the algorithm.

If the algorithm is followed by one or more paragraphs that refer to any of the algorithm's variables, include those paragraphs within the `<div>`, so that they can participate in var-highlighting.

Sometimes, a set of related algorithms (e.g., the 4 associated algorithms of a reflected target) are presented in a `<dl>`, where each `<dt>/<dd>` pair are (roughly speaking) the preamble and body of an algorithm. In these cases, each `<dt>/<dd>` pair is wrapped in `<div algorithm> ... </div>`.

---

According to the Infra standard, "very short algorithms can be declared and specified using a single sentence". (The HTML spec sometimes strains the idea of "very short".) So an algorithm might be contained by a single `<p>` element, and you might be tempted to just add the `algorithm` attribute to the `<p>`. But we prefer

```html
<div algorithm>
<p>...</p>
</div>
```

over

```html
<p algorithm>...</p>
```

as it makes refactoring easier, and is easy to spot.

In fact, a single `<p>` can contain two or more single-sentence algorithms. For instance, this sometimes happens with the getter and setter steps of an IDL attribute. You might think that each algorithm should get its own markup, but it's okay to put a single `<div algorithm>` around the multiple algorithms in the `<p>`.

---

In Bikeshed, the `algorithm` attribute has an optional value, which supplies the name of the algorithm. In the HTML spec, don't give the `algorithm` attribute a value.

#### What qualifies as an algorithm?

Algorithms are easy to spot when the body is a block element like `<ol>` or `<dl>` (when used like a 'switch' statement). But the existence of single-sentence algorithms (see above) can make it harder to know when you've written an algorithm.

Here are some categories of algorithms (roughly from commonest to rarest):

* Generally, if you have a term in a `<dfn>` element, followed by a description of how to 'implement' that term, that's probably an algorithm. Likewise if the term is in a `<span>` element; the `<dfn>` might be elsewhere in the spec, or even in a different spec.

* Most Web IDL interface members (attributes and operations) have associated behavior. Any text that defines such behavior is an algorithm, even it just says that an IDL attribute reflects a content attribute, or that a method does nothing.

* Text of roughly the form

  ```html
  When [something happens], the user agent must [do something].
  ```

  or

  ```html
  When [something happens], [do something].
  ```

  is probably an algorithm.

* The behavior of each tokenization state is an algorithm. Similarly for the behavior of each insertion mode.

* The JavaScript spec declares some internal methods and implementation-defined abstract operations, but leaves their definitions to the 'host'. Any text that defines such JavaScript-related behavior is an algorithm. Typically, the method/operation's signature (name and parameter list) is given in an `<hN>` element; include this in the `<div algorithm>`.

* There are format-definitions, which typically start with wording such as:

  ```html
  A string is a <dfn>foo</dfn> if it consists of...
  ```

  or

  ```html
  A <dfn>foo</dfn> is a string containing...
  ```

  These aren't algorithms per se, but they're wrapped in `<div algorithm>` by special dispensation.

* Even algorithms that appear in examples should be marked up.

Note that this list isn't exhaustive. There are things that are clearly algorithms that don't fit into any of the above categories. There are cases where it's unclear.

And it's possible that we'll change our minds about what should be marked as an algorithm.

### `<var>` and `var-scope`

For every `<var>` element, one or more of the following should be true:

* It has the `ignore` attribute.
* It is within an element with the `var-scope` attribute.
* It is within an element with the `algorithm` attribute.
* It is within a `<dl>` element with `class="domintro"`.

The build process will complain if it finds an 'unscoped' `<var>`, one for which none of the above is true.

Most of the time, any `<var>` element that you introduce will be within a `<div algorithm>` or a `<dl class="domintro">`. But for other cases, the question arises as to whether to mark a `<var>` with `ignore` or mark an ancestor with `var-scope` (possibly creating a `<div>` to have the `var-scope`). Here are some guidelines:

- When you have a set of consecutive algorithms that share variables, put `<div var-scope> ... </div>` around the algorithms and any preamble that mentions the shared variables.
- In any context that has two or more `<var>` elements with the same variable-name, mark the context with `var-scope`, or put a `<div var-scope>` around it, so that the `<var>`s will participate in var-highlighting.
- Even when a context has only single-use `<var>`s, it can be easier (if there's enough of them) to mark the context `var-scope` rather than mark each `<var>` as `ignore`.
- But if a context has only one `<var>`, or two with different variable-names, probably use `ignore`.

But there's an additional situation in which to use `ignore`. In addition to looking for unscoped `<var>`s, the build process will examine the `<var>`s within each algorithm. Typically, a given variable-name will appear at least twice in an algorithm: once when it's declared/defined, and one or more times when it's used. So it's supicious if a variable-name appears only *once* within an algorithm, and the build process will raise a warning about it. If you have a `<var>` that should be ignored by this check, mark it with `ignore`.

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
