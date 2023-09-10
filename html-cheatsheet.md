# HTML Cheatsheet

## Structure

This is the basic structure of an HTML file  

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>HTML 5 Boilerplate</title>
     </head>
  <body>
  </body>
</html>
```

- `<!DOCTYPE html>`:Lets the browser know which version of HTML is being used for your file.
- `<head>`: The root element of an HTML document.
- `<body>`: Holds the content of the document
- `<html>`: The root element of an HTML document.
- `<title>`: Specifies the title of the document.

## Headings

There are six headings that are often used in HTML.  &lt;h1> is the biggest and &lt;/h6> is the smallest.

```html
<h1> Heading 1</h1>
<h2> Heading 2</h2>
<h3> Heading 3</h3>
<h4> Heading 4</h4>
<h5> Heading 5</h5>
<h6> Heading</h6>
```

Note: It’s often recommended to put a `<h1>` tag at the beginning of a file and then go in chronological order to make the code accessible.

## Tags

These are elements used to present the content of your HTML file.

```html
<element> Content</element> 
```

- Opening tag: starts the beginning of the element (e.g., `<element>`)
- Closing tag: ends the element (e.g., `</element>`)

### Image

This element is used to display images

```html
<img src="image.png" alt="text"> 
```

- `src` = the place where you get the element(e.g., website, your computer)
- `alt`= provides a brief description of the image, which is read by screen readers for people with disabilities

### Paragraph

Used to display a block of text.

```html
<p> Hello World!</p>
```

### Anchor

Used to display links to other resources  

```html
<a href ="link to resource"> Text to indicate action</a> 
```

- `href`: specifies the URL of the linked document or location.

### Button

Used to display a button

```html
<button>Submit</button>
```

### Horizontal Line

Used to display a horizontal line

```html
<hr>
```

### Line Break

Used to display a line, which helps break a block of text

```html
<br> 
```

### Div

Used to create containers when setting up layouts

```html
<div> Content </div>
```

### Strong

Used to make text bold.

```html
<strong> Content </strong>
```

### Em

Displays text as italics. Used to emphasize information.

```html
<em> </em>
```

### Lists

```html
<ol>
  <li>This is the first item in the ordered list</li>
  <li>This is the second item in the ordered list</li>
  <li>This is the third item in the ordered list</li>
</ol>

<ul>
  <li>list item</li>
  <li>list item</li>
  <li>list item</li>
</ul>
```

- `<ul>`: Unordered list element that creates a list of items without any particular order.
- `<ol>`: Ordered list element that creates a list of items in a specific order.
- `<li>`: List item element that defines an item in a list.

## Semantic Elements

Tags that are representative of the content presented in an HTML file, resulting in accessible content, improved SEO, and readable code

### Article

Represents an independent, self-contained piece of content, such as a blog post or news article. Acts similarly to the `<div>` tag.

```html
<article>
Content
</article>
```

### Section

Defines elements in a document, such as chapters, headings, or any other area of the document with the same theme.

```html
<section>
Content
<section>
```

### Footer

Represents a part of a page that is meant to be at the end of a completed block of content. Commonly used to display copyright information for the page or additional links to relevant pages.

```html
<footer>
Content goes here
</footer>
```

### Header

Displays introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also a logo, a search form, an author name, and other elements.

```html
<header>
Content
</header>
```

## Attributes

These components describe certain characteristics of an HTML element ranging from the width, font style, and color of a text.  \

```html
attribute_name="value"
```

### ID

Adds an identifier that is associated with an HTML element. Used to style only one HTML element in CSS  

```html
<element id ="descriptive name">Content </element>
```

### Class

Adds an identifier that is associated with an HTML element. Used to style multiple HTML elements in CSS

```html
<element class ="descriptive name"> Content</element>
```

### Span

Groups text or elements together with classes and ids for styling and scripting. Usually wrapped inside another element and should be**only** used whenever there is no semantic HTML tag to be used.

```html
<span> Text</span>
```

### Style

Specifies the CSS styles for an HTML element.

```html
<element style="property: value"> Content</element>
```

## Additional Resources

If you’re looking for other sources to expand your knowledge, we highlight recommend these sources

- [MDN: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [Codecademy Docs: HTML](https://www.codecademy.com/resources/docs/html)
