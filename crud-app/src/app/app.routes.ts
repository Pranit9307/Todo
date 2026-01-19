import { Routes } from '@angular/router';
import { Index } from './post/index/index';
import { Create } from './post/create/create';
import { Edit } from './post/edit/edit';

export const routes: Routes = [
    { path : "", redirectTo : "/posts", pathMatch : "full" },
    { path : "posts", component : Index },  
    { path : "posts/create", component : Create},
    { path : "posts/edit/:id", component : Edit}
];