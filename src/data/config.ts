// =============================================================================
// Unified Store Configuration - Soft99
// =============================================================================

export const STORE = {
    name: 'Soft99',
    tagline: 'قطع غيار الدراجات النارية',
    domain: 'soft99.sa',
    whatsapp: '966568663381',
    whatsapp2: '966580874790',
    location: {
        city: 'جيزان',
        address: 'بجوار مستشفى العميس',
        maps: 'https://maps.app.goo.gl/t6pyLPj52d18BaPH6',
        coordinates: { lat: 16.9064, lng: 42.5525 }
    },
    hours: {
        open: '17:30',
        close: '03:00',
        display: 'يومياً من 5:30 عصراً حتى 3:00 فجراً'
    },
    social: {
        snapchat: 'h5jk6'
    }
} as const;

// Legacy export for backwards compatibility
export const WHATSAPP_NUMBER = STORE.whatsapp;
