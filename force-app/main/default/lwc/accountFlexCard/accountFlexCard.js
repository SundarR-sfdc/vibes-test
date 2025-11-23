import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { NavigationMixin } from 'lightning/navigation';

const FIELDS = [
    'Account.Name',
    'Account.Industry',
    'Account.Phone',
    'Account.Website',
    'Account.BillingStreet',
    'Account.BillingCity',
    'Account.BillingState',
    'Account.BillingPostalCode',
    'Account.BillingCountry',
    'Account.AnnualRevenue'
];

export default class AccountFlexCard extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;

    // Configurable properties (appear in App Builder properties)
    @api showName = false;
    @api showIndustry = false;
    @api showPhone = false;
    @api showWebsite = false;
    @api showBilling = false;
    @api showAnnualRevenue = false;
    @api showContacts = false;
    @api showOpportunities = false;
    @api logoUrl = '';

    title = 'Account Details';

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    record;

    get account() {
        return this.record && this.record.data ? this.record.data.fields : {};
    }

    // Inline SVG placeholder (48x48) as data URI to avoid external requests or static resources
    get _placeholderLogo() {
        return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' fill='%23c0c4cc'/><text x='50%' y='50%' font-size='20' fill='%23ffffff' dominant-baseline='middle' text-anchor='middle'>AC</text></svg>";
    }

    // Helper to detect whether a field exists on the record payload (helps detect FLS)
    fieldPresent(fieldApiName) {
        return Object.prototype.hasOwnProperty.call(this.account || {}, fieldApiName);
    }

    // Generic helper to return value or fallback marker when field is missing due to FLS
    getFieldValue(fieldApiName) {
        if (!this.fieldPresent(fieldApiName)) return { present: false, value: '' };
        const val = this.account?.[fieldApiName]?.value;
        return { present: true, value: val != null ? val : '' };
    }
    get billingAddress() {
        const f = this.account;
        const street = f?.BillingStreet?.value;
        if (!street && !f?.BillingCity?.value && !f?.BillingState?.value && !f?.BillingPostalCode?.value && !f?.BillingCountry?.value) {
            return '';
        }
        const parts = [street, f?.BillingCity?.value, f?.BillingState?.value, f?.BillingPostalCode?.value, f?.BillingCountry?.value].filter(Boolean);
        return parts.join(', ');
    }

    get phone() {
        const r = this.getFieldValue('Phone');
        return r.present ? r.value || '' : '(no access)';
    }

    get website() {
        const r = this.getFieldValue('Website');
        return r.present ? r.value || '' : '(no access)';
    }

    get name() {
        const r = this.getFieldValue('Name');
        return r.present ? r.value || '' : '(no access)';
    }

    get industry() {
        const r = this.getFieldValue('Industry');
        return r.present ? r.value || '' : '(no access)';
    }

    get annualRevenue() {
        const r = this.getFieldValue('AnnualRevenue');
        return r.present ? (r.value != null ? r.value : '') : '(no access)';
    }

    get phoneHref() {
        return this.phone ? `tel:${this.phone}` : null;
    }

    get websiteHref() {
        return this.website ? (this.website.startsWith('http') ? this.website : `https://${this.website}`) : null;
    }

    get logoSrc() {
        // Priority: explicit logoUrl (from App Builder) -> clearbit from website domain -> inline placeholder
        if (this.logoUrl) return this.logoUrl;
        const site = this.website;
        if (site && site !== '(no access)') {
            try {
                const url = site.startsWith('http') ? new URL(site) : new URL(`https://${site}`);
                const host = url.hostname;
                if (host) return `https://logo.clearbit.com/${host}`;
            } catch (e) {
                // fall through to placeholder
            }
        }
        return this._placeholderLogo;
    }

    // Related list: Contacts (first page, limited)
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts',
        fields: ['Contact.Id', 'Contact.Name', 'Contact.Email', 'Contact.Phone'],
        page: 1,
        pageSize: 5
    })
    contactsWire;

    get contactsList() {
        const data = this.contactsWire && this.contactsWire.data;
        if (!data || !data.records) return [];
        return data.records.map(r => ({
            id: r.fields.Id.value,
            name: r.fields.Name ? r.fields.Name.value : '',
            email: r.fields.Email ? r.fields.Email.value : '',
            phone: r.fields.Phone ? r.fields.Phone.value : '',
            meta: `${r.fields.Email && r.fields.Email.value ? r.fields.Email.value : ''}${r.fields.Phone && r.fields.Phone.value ? ' • ' + r.fields.Phone.value : ''}`
        }));
    }

    get contactsLoaded() {
        return !!(this.contactsWire && this.contactsWire.data && this.contactsWire.data.records);
    }

    get contactsEmpty() {
        const list = this.contactsList;
        return Array.isArray(list) && list.length === 0;
    }

    handleViewContacts() {
        if (!this.recordId) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            }
        });
    }

    handleOpenContact(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }

    // Related list: Opportunities (first page, limited)
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Opportunities',
        fields: ['Opportunity.Id', 'Opportunity.Name', 'Opportunity.StageName', 'Opportunity.Amount'],
        page: 1,
        pageSize: 5
    })
    opportunitiesWire;

    get opportunitiesList() {
        const data = this.opportunitiesWire && this.opportunitiesWire.data;
        if (!data || !data.records) return [];
        return data.records.map(r => ({
            id: r.fields.Id.value,
            name: r.fields.Name ? r.fields.Name.value : '',
            stage: r.fields.StageName ? r.fields.StageName.value : '',
            amount: r.fields.Amount ? r.fields.Amount.value : '',
            meta: `${r.fields.StageName && r.fields.StageName.value ? r.fields.StageName.value : ''}${r.fields.Amount && r.fields.Amount.value ? ' • $' + r.fields.Amount.value : ''}`
        }));
    }

    get opportunitiesLoaded() {
        return !!(this.opportunitiesWire && this.opportunitiesWire.data && this.opportunitiesWire.data.records);
    }

    get opportunitiesEmpty() {
        const list = this.opportunitiesList;
        return Array.isArray(list) && list.length === 0;
    }

    handleViewOpportunities() {
        if (!this.recordId) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Opportunities',
                actionName: 'view'
            }
        });
    }

    handleOpenOpportunity(event) {
        const id = event.currentTarget.dataset.id;
        if (!id) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: id,
                objectApiName: 'Opportunity',
                actionName: 'view'
            }
        });
    }

    handleEdit() {
        if (!this.recordId) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                actionName: 'edit'
            }
        });
    }

    handleOpen() {
        if (!this.recordId) return;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Account',
                actionName: 'view'
            }
        });
    }
}
