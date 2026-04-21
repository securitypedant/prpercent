# Weightlifting Percentage Calculator

A simple Astro-based web app to calculate weightlifting percentages and show barbell plate configurations.

## Features

- Enter your personal best weight for any lift (e.g., Bench Press 195lbs)
- Automatically calculates percentages from 40% to 95%
- Rounds up to nearest 5lb increment
- Shows barbell plate breakdown for each percentage
- Save up to 3 lifts locally in your browser (localStorage)
- Built with Astro and Bootstrap 5

## Barbell Plate Breakdown

The app assumes a 45lb bar and calculates plate combinations using:
- 45lb plates
- 25lb plates
- 10lb plates
- 5lb plates

## Project Structure

```
/
├── public/
│   └── app.js              # Client-side JavaScript
├── src/
│   └── pages/
│       └── index.astro     # Main page
├── astro.config.mjs        # Astro config with Cloudflare adapter
└── package.json
```

## Development

```sh
npm install
npm run dev          # Starts dev server at localhost:4321
```

## Building

```sh
npm run build        # Builds to ./dist/
```

## Deploying to Cloudflare Workers

### Option 1: Using Wrangler CLI

1. Install Wrangler (if not already installed):
```sh
npm install -g wrangler
```

2. Login to Cloudflare:
```sh
wrangler login
```

3. Deploy:
```sh
wrangler deploy
```

### Option 2: Using the Cloudflare Dashboard

1. Build the project: `npm run build`
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Navigate to Workers & Pages
4. Click "Create application"
5. Select "Upload assets"
6. Upload the contents of the `dist/` folder

## Tech Stack

- [Astro](https://astro.build/) - Web framework
- [Bootstrap 5](https://getbootstrap.com/) - CSS framework
- [Cloudflare Workers](https://workers.cloudflare.com/) - Hosting platform
# prpercent
