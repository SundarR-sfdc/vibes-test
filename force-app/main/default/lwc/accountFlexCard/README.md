accountFlexCard — Developer README

Purpose
- A small Lightning Web Component that displays key Account fields in a compact flex-card layout. Includes optional related lists for Contacts and Opportunities, an admin-configurable logo URL, and quick actions.

Key files
- `accountFlexCard.js` — main logic: uses `getRecord` and `getRelatedListRecords` wires, exposes `@api` properties used by App Builder.
- `accountFlexCard.html` — template with conditional rendering and lists.
- `accountFlexCard.css` — styles.
- `accountFlexCard.js-meta.xml` — component metadata and App Builder property definitions.

Public properties (available in App Builder)
- `showName`, `showIndustry`, `showPhone`, `showWebsite`, `showBilling`, `showAnnualRevenue` (Booleans)
- `showContacts`, `showOpportunities` (Booleans)
- `logoUrl` (String)

Deploy
```bash
sfdx force:source:deploy -p force-app/main/default/lwc/accountFlexCard -u vsCodeOrg
```

Test
- Add the component to an Account record page via Lightning App Builder. Toggle properties in the right-hand Properties pane and verify behavior.

Notes
- The component handles missing fields and FLS by showing `(no access)` when a field is not present in the UI API payload.
- Logo fallback order: `logoUrl` (App Builder) → Clearbit (`https://logo.clearbit.com/<domain>`) → inline SVG placeholder.
