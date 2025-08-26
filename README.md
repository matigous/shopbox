# 🛍️ Shopbox - E-commerce SPA

A modern e-commerce application built with Angular 19, demonstrating advanced concepts like Signals, Lazy Loading, Route Guards, and reactive state management.

## 📋 About the Project

This project is a Single-Page Application (SPA) of an online store that allows users to view products, log in, and manage a shopping cart. The application works both online (consuming the FakeStoreAPI) and offline (using mocked data).

### 🎯 Key Features

  - **🏪 Product Catalog**: Product listing and details
  - **🔐 Authentication System**: Secure login with JWT
  - **🛒 Shopping Cart**: Add, remove, and manage items
  - **👨‍💼 Admin Area**: Product CRUD with lazy loading
  - **📱 Offline Mode**: Works without internet using mocked data
  - **🔄 Reactive State**: Managed with Angular Signals

## 🚀 Modes

### 🌐 Development Mode

  - Consumes data from [FakeStoreAPI](https://fakestoreapi.com/)
  - Real authentication via API
  - Connected CRUD operations

## 🛠️ Technologies Used

  - **Angular 19** - Main framework
  - **TypeScript** - Programming language
  - **Bootstrap 5** - CSS framework
  - **RxJS** - Reactive programming
  - **Angular Signals** - Modern state management
  - **Angular Router** - Routing and navigation

## 📦 Installation and Execution

### Prerequisites

  - Node.js 18+
  - npm 9+
  - Angular CLI 19+

### 🔧 Installation

```bash
git clone https://github.com/matigous/shopbox.git

cd angular-store

npm install

ng serve
```

The application will be available at `http://localhost:4200`

### 🏗️ Production Build

```bash
ng build --configuration production

npx http-server dist/shopbox
```

## 👥 Test Users (Development Mode)

| Username  | Password | Profile       |
|-----------|----------|---------------|
| `johnd` | `m38rmF$` | Administrator   |

## 🔗 Application Routes

| Route        | Description              | Protection  |
|--------------|--------------------------|-------------|
| `/`          | Redirects to `/home`     | Public      |
| `/home`      | Home page with products  | Public      |
| `/product/:id` | Product details          | Public      |
| `/login`     | Login page               | Public      |
| `/cart`      | Shopping cart            | 🔒 Protected |
| `/admin`     | Administration (Lazy Loading) | 🔒 Protected |

## 🏗️ Project Architecture

```
src/app/
├── components/         # Reusable components
│   ├── navbar/         # Navigation bar
│   └── product-card/   # Product card
├── pages/              # Application pages
│   ├── home/           # Home page
│   ├── product-detail/ # Product details
│   ├── login/          # Login page
│   ├── cart/           # Shopping cart
│   ├── admin/          # Admin area
│   └── not-found/      # 404 page
├── services/           # Data services
│   ├── product.service.ts  # Product management
│   ├── auth.service.ts     # Authentication
│   ├── cart.service.ts     # Shopping cart
│   └── mock-data.service.ts # Mocked data
├── guards/             # Route guards
│   └── auth.guard.ts   # Route protection
├── interceptors/       # HTTP Interceptors
│   └── auth.interceptor.ts # Automatic token
└── environments/       # Environment settings
```

## 🎨 Angular Concepts Implemented

### 🔄 Signals (New in Angular 16+)

```typescript
public products = signal<Product[]>([]);
public totalItems = computed(() =>
  this.cartItems().reduce((total, item) => total + item.quantity, 0)
);
```

### 🚀 Lazy Loading

```typescript
{
  path: 'admin',
  loadComponent: () => import('./pages/admin/admin.component')
    .then(m => m.AdminComponent),
  canActivate: [authGuard]
}
```

### 🛡️ Route Guards

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isLoggedIn() ? true : false;
};
```

### 🔌 HTTP Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

## 🤝 Contributing

1.  Fork the project
2.  Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for more details.

## 👨‍💻 Author

Developed by Matheus Vilela Diniz Maia.

-----

### 🎯 Educational Objective

This project demonstrates the practical implementation of:

  - ✅ Componentization and communication between components
  - ✅ Services and dependency injection
  - ✅ Routing and protection guards
  - ✅ State management with Signals
  - ✅ HTTP Interceptors for authentication
  - ✅ Lazy loading for optimization
  - ✅ Error handling and fallbacks
  - ✅ Responsiveness with Bootstrap
