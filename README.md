# html-compose

Static HTML builder with component-style includes, props and watch mode.

Build modular HTML pages using reusable components without a framework.

You can split HTML into components and compose pages with:

- `include()` for components
- `props` for passing data
- `iff()` for conditional rendering
- watch mode for automatic rebuilding

---

## Installation

Install in your project:

```bash
npm install html-compose
```

---

## Usage

Build a directory:

```bash
html-compose src dist
```

Watch mode:

```bash
html-compose src dist --watch
```

Example `package.json` scripts:

```json
{
  "scripts": {
    "build:html": "html-compose src dist",
    "watch:html": "html-compose src dist --watch"
  }
}
```

Run with:

```bash
npm run watch:html
```

---

## Example Project Structure

```
src/
  index.html
  about.html

  _components/
    header.html
    footer.html
    card.html
```

Files and folders starting with `_` are treated as **private templates**.

They are not rendered as standalone pages, but can be included inside other HTML files.

---

## Include Components

```html
${ await include('./_components/header.html') }
```

Components can be nested and reused across multiple pages.

---

## Passing Props

Props can be passed into components.

### Page

```html
${ await include('./_components/card.html', {
  title: 'Hello',
  text: 'Welcome to the site'
}) }
```

### Component

```html
<div class="card">
  <h2>${ props.title }</h2>
  <p>${ props.text }</p>
</div>
```

---

## Conditional Rendering

Use `iff()` for conditional rendering.

```html
${ iff(props.loggedIn, `
  <p>Welcome back!</p>
`) }
```

With an `else` case:

```html
${ iff(props.loggedIn,
  `<p>Welcome!</p>`,
  `<p>Please log in</p>`
) }
```

---

## Watch Mode

Watch mode automatically rebuilds when HTML files change.

```bash
html-compose src dist --watch
```

Example output:

```
[html-compose] built index.html
[html-compose] built about.html
[html-compose] watch mode
```

---

## Private Templates

Any file or directory starting with `_` is **not rendered as a page**.

Example:

```
src/
  index.html
  _components/
    header.html
    footer.html
```

Output:

```
dist/
  index.html
```

But components can still be used via `include()`.

---

## Example Page

```html
<body>

${ await include('./_components/header.html', {
  title: "My Site"
}) }

<main>
  <h1>Hello</h1>
</main>

${ await include('./_components/footer.html') }

</body>
```

---

## How It Works

The build pipeline:

```
HTML files
   ↓
include()
   ↓
props
   ↓
iff()
   ↓
render
   ↓
dist output
```

Templates are rendered using a JavaScript-based template engine internally.

---

## Roadmap

Possible future features:

- `each()` loops
- dependency graph for faster watch rebuilds
- HTML minification
- layouts
- plugin system

---

## License

MIT