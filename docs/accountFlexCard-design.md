**Account Flex Card — Design & Admin Guide**

**Overview**
- **Purpose:** A compact Lightning Web Component (LWC) used on Account record pages to display key account details in a flex-card style. It is admin-configurable from the Lightning App Builder and shows optional related lists (Contacts, Opportunities), an icon/logo, and quick actions (Edit/Open/View All related lists).
- **Location (code):** `force-app/main/default/lwc/accountFlexCard/`
- **Deployed to:** org alias `vsCodeOrg` (already deployed).

**Visual (wireframe)**
- Card header: circular logo (48x48) at left, title "Account Details" to the right
- Grid: Name | Industry | Phone | Website | Billing Address | Annual Revenue
- Related lists (optional): Contacts (up to 5 rows) and Opportunities (up to 5 rows)
- Actions: Edit, Open, and 'View All' on related lists

ASCII mockup:

    ┌───────────────────────────────────────────────┐
    │ ● (logo)   Account Details                    │
    │ --------------------------------------------- │
    │ Name: Acme Co.            Industry: Tech      │
    │ Phone: (555) 555-5555     Website: acme.com   │
    │ Billing Address: 123 Main St, City, ST 12345  │
    │ Annual Revenue: $1,000,000                   │
    │                                               │
    │ Contacts                                      │
    │  - Jane Doe        jane@acme.com • (555) 111  │
    │  - John Smith      john@acme.com • (555) 222  │
    │  [View All]                                    │
    │                                               │
    │ [Edit] [Open]                                 │
    └───────────────────────────────────────────────┘

**Files & code references**
- `accountFlexCard.js` — component logic, `@api` properties, UI API reads (getRecord, getRelatedListRecords), navigation handlers.
- `accountFlexCard.html` — template with conditional rendering and related lists.
- `accountFlexCard.css` — styling (round logo, grid, related-list styling).
- `accountFlexCard.js-meta.xml` — metadata: exposes design properties (toggles and Logo URL) to Lightning App Builder.

**Admin-facing configuration (what you see in App Builder)**
- Properties (checkboxes & text field):
  - Show Name (Boolean)
  - Show Industry (Boolean)
  - Show Phone (Boolean)
  - Show Website (Boolean)
  - Show Billing Address (Boolean)
  - Show Annual Revenue (Boolean)
  - Show Contacts (related list) (Boolean)
  - Show Opportunities (related list) (Boolean)
  - Logo URL (String) — optional; paste a direct HTTPS image URL or a static resource URL.

How to change those settings:
1. Open an Account record in Lightning.
2. Click the gear icon → Edit Page (Lightning App Builder).
3. Select `accountFlexCard` component on the canvas.
4. In the right Properties pane, toggle checkboxes or paste a `Logo URL`.
5. (Optional) Click "Set Component Visibility" to add visibility rules (Record Type, App, Profile, etc.).
6. Click Save → Back → Refresh Account record to see results.

Screenshots
- I can't embed live screenshots here, but you can capture these from your org and drop them into your documentation folder if needed. Useful screenshots to capture:
  - App Builder component selected with Properties pane visible (shows checkboxes and Logo URL field).
  - Account record page with component visible showing logo, fields, and related lists.
  - Inspector showing network request for `https://logo.clearbit.com/<domain>` (optional).

To create and add screenshots locally:
1. Open the Account in Lightning and App Builder as above.
2. Take screenshots and save them to `docs/images/` (create folder if absent).
3. Reference them in this document using Markdown: `![App Builder](images/app-builder.png)`.

Design details — `@api` usage and rationale
- What the component exposes
  - The component declares a set of public properties with `@api` in `accountFlexCard.js`. These are mapped to metadata `<property>` entries in `accountFlexCard.js-meta.xml`. When the component is added to a Lightning Page, these become editable controls in the App Builder's Properties pane.

- Example `@api` fields (from code):
  - `@api showName` (Boolean)
  - `@api showPhone` (Boolean)
  - `@api showContacts` (Boolean)
  - `@api logoUrl` (String)

- Why this approach (advantages)
  1. **Admin-friendly & declarative:** Admins can configure the component without code or redeploys. Changes are stored in the Lightning Page metadata and take effect immediately after Save.
  2. **Per-page customisation:** Different record pages (or different Apps/Profiles) can configure the component differently — useful when one team needs more fields than another.
  3. **No extra storage or complex admin data model required:** Settings live with the page metadata; no need for custom metadata, custom settings, or extra objects for per-page configuration.
  4. **Low maintenance:** Implementation uses UI API and standard LWC patterns and handles security (FLS) on reads.

Comparison with an alternative design
- Alternative A: Central configuration via Custom Metadata / Custom Settings
  - How it works: Admins create Custom Metadata records or Custom Settings containing the list of fields and flags for features. The component reads these records at runtime (via Apex or wire to Data API).
  - Pros:
    - Single source of truth for global settings; easy to change for all pages at once.
    - Good for org-wide defaults or feature flags.
  - Cons:
    - Requires admins to navigate to a separate setup area (not App Builder) to change config.
    - Changing settings affects all pages (less flexible for per-page variation).
    - Component needs code to fetch the metadata and handle caching; often requires Apex (added maintenance & testing).

- Alternative B: Hard-coded or developer-only configuration
  - How it works: Developers change the component code or constants and redeploy for any change.
  - Pros: Simple to implement.
  - Cons: Requires developer work and deployment for every change; non-admin friendly.

- Why the chosen `@api` per-page App Builder approach is better here
  - The component is a UI widget intended to be placed on record pages and frequently adjusted by admins — per-page App Builder properties match the way admins already customize pages.
  - Admins commonly need different sets of fields for different Lightning Apps or profiles; App Builder properties provide that flexibility without extra metadata or deployment.
  - For org-wide control, combine approaches: keep per-page App Builder toggles for page-specific tweaks and add optional Custom Metadata for global defaults. The component could read Custom Metadata for defaults but still allow per-page overrides — this gives best of both worlds.

Design trade-offs & notes
- Duplication: If many pages need identical settings, per-page toggles mean repeated configuration. Mitigation: create a single master Lightning Record Page and assign it as Org Default or App Default in App Builder Activation.
- Security: UI API returns only fields accessible to current user. The component checks for field presence and displays `(no access)` when a field is not returned due to FLS — this prevents template errors and informs users.
- External images & CSP: The component uses the optional `Logo URL` or Clearbit fallback (`https://logo.clearbit.com/<domain>`). If your org disallows external images via CSP, use a static resource (upload under `force-app/main/default/staticresources/`) and use the static resource URL in the `Logo URL` field.

Admin instructions (step-by-step)
1. Add the component to a page
   - Open an Account record → Gear → Edit Page.
   - Drag `accountFlexCard` from Custom - Lightning Web Components into the canvas.
2. Configure fields
   - With the component selected, toggle the checkboxes in the Properties pane to show/hide: Name, Industry, Phone, Website, Billing, Annual Revenue, Contacts, Opportunities.
3. Logo
   - If you want a specific logo, upload it as a static resource or host it on HTTPS and paste the URL into `Logo URL`.
   - Example Clearbit test URL: `https://logo.clearbit.com/salesforce.com`.
4. Visibility rules
   - Use Set Component Visibility to show the card only to certain Profiles, Record Types, or Apps.
5. Save & Activate
   - Click Save. If this is a new page, click Activation and choose Org Default / App Default / Profiles as required.

Command-line tips (sfdx)
- Deploy the component after code changes:
```bash
sfdx force:source:deploy -p force-app/main/default/lwc/accountFlexCard -u vsCodeOrg
```
- Upload a static resource (example if you add `company_logo.png` to `force-app/main/default/staticresources/company_logo.resource`):
```bash
sfdx force:source:deploy -p force-app/main/default/staticresources -u vsCodeOrg
```

Troubleshooting
- Component not listed in App Builder:
  - Ensure `accountFlexCard.js-meta.xml` contains `<isExposed>true</isExposed>` and target `lightning__RecordPage`.
  - Re-deploy the component and reload the App Builder.
- Blank fields or missing values:
  - Check field-level security for the current user — the component shows `(no access)` when a field is not visible.
- Logo not showing:
  - Verify the URL is HTTPS and reachable from your browser; if blocked by CSP, upload the image as a static resource and use that URL.

Future enhancements (ideas)
- Pagination or 'Load more' for related lists.
- Configurable related-list fields (allow admin to choose which columns show for Contacts/Opportunities).
- Caching or Custom Metadata default fallback for global defaults with per-page override.

Document history
- v1.0 — Initial component, App Builder toggles, logo fallback, FLS handling, Contacts + Opportunities related lists — 2025-11-23

Contact
- For questions or changes, open an issue in the repository or contact the developer.
