import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CartComponent } from './pages/cart/cart.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    title: 'BookVerse - Home' 
  },
  { 
    path: 'about', 
    component: AboutComponent,
    title: 'BookVerse - About Us'
  },
  { 
    path: 'contact', 
    component: ContactComponent,
    title: 'BookVerse - Contact Us'
  },
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'BookVerse - Login'
  },
  { 
    path: 'signup', 
    component: SignupComponent,
    title: 'BookVerse - Sign Up'
  },
  { 
    path: 'cart', 
    component: CartComponent,
    title: 'BookVerse - Shopping Cart',
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];