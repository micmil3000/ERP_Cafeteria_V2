import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { DashboardPageComponent } from './modules/dashboard/dashboard-page/dashboard-page.component';
import { FinancePageComponent } from './modules/finanzas/finance-page/finance-page.component';
import { SalesPageComponent } from './modules/ventas/sales-page/sales-page.component';
import { TicketPageComponent } from './modules/ticket/ticket-page/ticket-page.component';
import { PurchasesPageComponent } from './modules/compras/purchases-page/purchases-page.component';
import { LoginPageComponent } from './modules/login/login-page/login-page.component';
import { HumanResourcesPageComponent } from './modules/recursos-humanos/human-resources-page/human-resources-page.component';
import { inventoryPageComponent } from './modules/inventario/inventory-page/inventory-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginPageComponent, title: 'Iniciar sesión | Savia Café ERP' },
	{
    	path: '', 
		component: AppLayoutComponent,
		children: [
			{
				path: 'recursos-humanos',
				component: HumanResourcesPageComponent,
				data: { sectionTitle: 'Recursos Humanos' },
				title: 'Recursos Humanos | Savia Café ERP',
			},
			{
				path: 'compras',
				component: PurchasesPageComponent,
				data: { sectionTitle: 'Compras y Proveedores' },
				title: 'Compras y Proveedores | Savia Café ERP',
			},
			{
				path: 'ventas/ticket',
				component: TicketPageComponent,
				data: { sectionTitle: 'Comprobante de venta' },
				title: 'Ticket | Savia Café ERP',
			},
			{
				path: 'ventas',
				component: SalesPageComponent,
				data: { sectionTitle: 'Ventas' },
				title: 'Ventas | Savia Café ERP',
			},
			{
				path: 'inventario',
				component: inventoryPageComponent,
				data: { sectionTitle: 'Inventario' },
				title: 'Inventario | Savia Café ERP',
			},
			{
				path: 'finanzas',
				component: FinancePageComponent,
				data: { sectionTitle: 'Contabilidad y Finanzas' },
				title: 'Finanzas | Savia Café ERP',
			},
			{
				path: 'inicio',
				component: DashboardPageComponent
			}
		]
	},
];
