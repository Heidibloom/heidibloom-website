# Heidi Bloom website package

This ZIP contains the website, Netlify-compatible inquiry form, editable content files, and a Sveltia CMS admin entry at `/admin/`.

## Included
- Editable About text
- Homepage image control
- Upload/remove/reorder gallery images
- Rotating testimonials
- Text or screenshot/image testimonials
- Theme presets and custom accent color
- Netlify inquiry form with honeypot spam field
- Privacy page
- `/admin/` CMS interface

## Important one-time setup after upload
The public website can be deployed immediately, but secure online editing requires a GitHub repository and CMS authentication setup. In `admin/config.yml`, replace:
`REPLACE_WITH_GITHUB_USERNAME/REPLACE_WITH_REPOSITORY`
with the GitHub repository that owns the site.

The inquiry destination email should be configured in the Netlify project dashboard under form submission notifications. This package intentionally does not fake or locally store Netlify billing/usage information.

## Hosting & Usage
Manage hosting, plan, domains, and form notifications directly in the Netlify dashboard. That remains the source of truth for hosting and billing.

## Media note
Compress photos before uploading. Avoid hosting large video files directly in this site repository.
