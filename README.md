# Harvest to Toggl Sync

A web application to export time entries from Harvest, edit them in a table, and import them to Toggl.

## Setup

1. Copy `.env.example` to `.env` and fill in your API credentials:
   - **Harvest**: Get your Personal Access Token from [Harvest Developer Tools](https://id.getharvest.com/developers)
   - **Toggl**: Get your API token from [Toggl Profile Settings](https://track.toggl.com/profile)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Features

- Fetch time entries from Harvest by date range
- Edit entries inline (double-click to edit)
- Add or delete rows
- Map Harvest projects to Toggl projects
- Import entries to Toggl with progress tracking

## Deploy to Vercel

1. Push this repo to GitHub

2. Import the project in [Vercel](https://vercel.com/new)

3. Add environment variables in the Vercel dashboard:
   - `HARVEST_ACCESS_TOKEN`
   - `HARVEST_ACCOUNT_ID`
   - `TOGGL_API_TOKEN`

4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/markdavies/harvest-toggl-sync&env=HARVEST_ACCESS_TOKEN,HARVEST_ACCOUNT_ID,TOGGL_API_TOKEN)
