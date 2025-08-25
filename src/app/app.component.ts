import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShopBox';
  public authService = inject(AuthService);
  public cartService = inject(CartService);

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
