import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },

	{
		path: "intro",
		loadChildren: () =>
			import("./pages/intro/intro.module").then((m) => m.IntroPageModule),
	},
	{
		path: "network-status",
		loadChildren: () =>
			import("./pages/network/network-status/network-status.module").then(
				(m) => m.NetworkStatusPageModule,
			),
	},
	{
		path: "network-overview",
		loadChildren: () =>
			import(
				"./pages/network/network-overview/network-overview.module"
			).then((m) => m.NetworkOverviewPageModule),
	},
	{
		path: "login",
		loadChildren: () =>
			import("./pages/login/login.module").then((m) => m.LoginPageModule),
	},
	{
		path: "settings",
		loadChildren: () =>
			import("./pages/settings/settings.module").then(
				(m) => m.SettingsPageModule,
			),
	},
	{
		path: "delegates",
		loadChildren: () =>
			import("./pages/delegates/delegates.module").then(
				(m) => m.DelegatesPageModule,
			),
	},

	{
		path: "profile/signin",
		loadChildren: () =>
			import(
				"./pages/profiles/profile-signin/profile-signin.module"
			).then((m) => m.ProfileSigninPageModule),
	},
	{
		path: "profile/create",
		loadChildren: () =>
			import(
				"./pages/profiles/profile-create/profile-create.module"
			).then((m) => m.ProfileCreatePageModule),
	},

	{
		path: "contacts/create",
		loadChildren: () =>
			import(
				"./pages/contacts/contact-create/contact-create.module"
			).then((m) => m.ContactCreatePageModule),
	},
	{
		path: "contacts",
		loadChildren: () =>
			import("./pages/contacts/contact-list/contact-list.module").then(
				(m) => m.ContactListPageModule,
			),
	},

	{
		path: "transaction/send",
		loadChildren: () =>
			import(
				"./pages/transaction/transaction-send/transaction-send.module"
			).then((m) => m.TransactionSendPageModule),
	},
	{
		path: "transaction/receive",
		loadChildren: () =>
			import(
				"./pages/transaction/transaction-receive/transaction-receive.module"
			).then((m) => m.WalletReceivePageModule),
	},
	{
		path: "transaction/response",
		loadChildren: () =>
			import(
				"./pages/transaction/transaction-response/transaction-response.module"
			).then((m) => m.TransactionResponsePageModule),
	},
	{
		path: "transaction/show",
		loadChildren: () =>
			import(
				"./pages/transaction/transaction-show/transaction-show.module"
			).then((m) => m.TransactionShowPageModule),
	},

	{
		path: "wallets/dashboard",
		loadChildren: () =>
			import(
				"./pages/wallet/wallet-dashboard/wallet-dashboard.module"
			).then((m) => m.WalletDashboardPageModule),
	},
	{
		path: "wallets/import",
		loadChildren: () =>
			import("./pages/wallet/wallet-import/wallet-import.module").then(
				(m) => m.WalletImportPageModule,
			),
	},
	{
		path: "wallets/import-manual",
		loadChildren: () =>
			import(
				"./pages/wallet/wallet-import-manual/wallet-import-manual.module"
			).then((m) => m.WalletManualImportPageModule),
	},
	{
		path: "wallets",
		loadChildren: () =>
			import("./pages/wallet/wallet-list/wallet-list.module").then(
				(m) => m.WalletListPageModule,
			),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
