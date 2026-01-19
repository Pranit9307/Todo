import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        const username = localStorage.getItem('username');
        if (username) {
            return true;
        }
        // Not logged in (Browser), redirect
        return router.parseUrl('/login');
    }

    // Allow server-side to render (Client will verify auth)
    return true;
};
