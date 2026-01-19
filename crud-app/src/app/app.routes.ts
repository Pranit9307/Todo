import { Routes } from '@angular/router';
import { Index } from './post/index/index';
import { Create } from './post/create/create';
import { Edit } from './post/edit/edit';
import { Login } from './login/login';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "posts", component: Index, canActivate: [authGuard] },
    { path: "posts/create", component: Create, canActivate: [authGuard] },
    { path: "posts/edit/:id", component: Edit, canActivate: [authGuard] },
    { path: "login", component: Login }
];