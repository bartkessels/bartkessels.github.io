# Bart Kessels Blog

A modern blog website built with [Astro](https://astro.build/) featuring content about software development, gardening, and travel stories.

## ✨ Features

- 🚀 Built with Astro 5.0 for optimal performance
- 📝 MDX support for rich content with embedded components
- 🎨 Styled with Tailwind CSS for responsive design
- 📚 Content collections for organized blog posts, gardening tips, software guides, and travel stories
- 🌙 Syntax highlighting with Shiki
- 📱 Mobile-responsive design
- 🔍 SEO optimized

## 🛠️ Tech Stack

- **Framework:** Astro 5.0
- **Content:** MDX (Markdown + JSX)
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Language:** TypeScript

## 🏗️ Project Structure

```
├── src/
│   ├── components/          # Reusable Astro components
│   ├── content/            # Content collections
│   │   ├── blog/          # Blog posts
│   │   ├── gardening/     # Gardening content
│   │   ├── software/      # Software development guides
│   │   └── stories/       # Travel and personal stories
│   ├── layouts/           # Page layouts
│   ├── pages/            # File-based routing
│   └── styles/           # Global CSS files
├── public/               # Static assets
└── components/           # Additional UI components
```

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)

If you don't have pnpm installed, you can install it globally:

```bash
npm install -g pnpm
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd bartkessels.net
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

### 🔄 Local Development

To start the development server:

```bash
pnpm dev
```

or

```bash
pnpm start
```

This will start the development server at `http://localhost:4321`. The page will automatically reload when you make changes to the source files.

### 📦 Building for Production

To build the website for production:

```bash
pnpm build
```

This command will:
1. Run Astro's type checking (`astro check`)
2. Build the optimized static site (`astro build`)

The built files will be generated in the `dist/` directory.

### 🔍 Preview Production Build

To preview the production build locally:

```bash
pnpm preview
```

This will serve the built website from the `dist/` directory at `http://localhost:4321`.

## 📝 Content Management

### Adding New Blog Posts

1. Create a new `.mdx` file in the appropriate content directory:
   - `src/content/blog/` for blog posts
   - `src/content/gardening/` for gardening content
   - `src/content/software/` for software guides
   - `src/content/stories/` for travel stories

2. Include the required frontmatter at the beginning of your file:
   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description of the post"
   publishDate: "2026-03-17"
   tags: ["tag1", "tag2"]
   ---
   ```

3. Write your content using Markdown or MDX syntax

### Images and Assets

- Place images in the `public/images/` directory
- Organize them by content type (e.g., `public/images/blog/`, `public/images/software/`)
- Reference images in your content using relative paths from the public directory

## 🎨 Customization

### Styling

The website uses Tailwind CSS for styling. You can:

- Modify the Tailwind configuration in `tailwind.config.mjs`
- Add custom styles in `src/styles/global.css`
- Update component styles directly in the Astro components

### Configuration

- Astro configuration: `astro.config.mjs`
- TypeScript configuration: `tsconfig.json`
- Tailwind configuration: `tailwind.config.mjs`

## 🚀 Deployment

The built website (from the `dist/` directory) can be deployed to any static hosting service:

- **Vercel:** Connect your repository and deploy automatically
- **Netlify:** Drag and drop the `dist/` folder or connect via Git
- **GitHub Pages:** Push the `dist/` contents to a GitHub Pages repository
- **Cloudflare Pages:** Connect your repository for automatic deployments

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm start` - Alias for `pnpm dev`
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Add your license information here]

## 🙋‍♂️ Support

If you have any questions or need help, please [open an issue](../../issues) on GitHub.