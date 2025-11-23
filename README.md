Docs: accountFlexCard

This folder contains design documentation and placeholder screenshots for the accountFlexCard Lightning Web Component.

What is included

accountFlexCard-design.md — design doc and admin guide (Markdown).
accountFlexCard-design.html — simple HTML export of the design doc for viewing in a browser.
images/ — placeholder images. Replace them with real screenshots captured from your org.
How to add screenshots

Open the Account record and the Lightning App Builder in your org.
Capture the App Builder properties pane (where the component properties show). Save as docs/images/app-builder.png.
Capture the Account record page with the flex card visible. Save as docs/images/account-page.png.
(Optional) Capture the browser DevTools Network tab showing an image request for https://logo.clearbit.com/<domain>. Save as docs/images/clearbit-network.png.
Re-open docs/accountFlexCard-design.html in a browser to preview.
Export to PDF (optional) If you want a PDF copy of the HTML or Markdown, use a tool such as pandoc or Chrome's Print → Save as PDF.

Example using pandoc (macOS/Linux):

Convert Markdown to PDF (requires pandoc + wkhtmltopdf or a PDF engine)
pandoc docs/accountFlexCard-design.md -o docs/accountFlexCard-design.pdf

Or convert HTML to PDF using Google Chrome headless (macOS):
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --print-to-pdf=docs/accountFlexCard-design.pdf docs/accountFlexCard-design.html
Developer README (component)

<img width="2858" height="1790" alt="image" src="https://github.com/user-attachments/assets/66b77be4-4ed1-4f20-b336-31f202acf474" />

<img width="2880" height="1496" alt="image" src="https://github.com/user-attachments/assets/5966bbcd-ec99-461b-8c98-7472a649c833" />

<img width="2870" height="1434" alt="image" src="https://github.com/user-attachments/assets/73b6a2a4-6bd6-498d-9b94-cdef2c1b1fb6" />
