import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Network, Peer } from "ark-ts";
import { Subject, throwError } from "rxjs";
import { catchError, debounceTime, takeUntil, tap } from "rxjs/operators";

import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { ToastProvider } from "@/services/toast/toast";

@Component({
	selector: "page-network-status",
	templateUrl: "network-status.html",
	styleUrls: ["network-status.pcss"],
})
export class NetworkStatusPage implements OnInit, OnDestroy {
	public currentNetwork: Network;
	public currentPeer: Peer;

	private unsubscriber$: Subject<void> = new Subject<void>();

	private refreshIntervalListener;
	private loader;

	constructor(
		private arkApiProvider: ArkApiProvider,
		private loadingCtrl: LoadingController,
		private zone: NgZone,
		private translateService: TranslateService,
		private toastProvider: ToastProvider,
	) {
		this.currentNetwork = this.arkApiProvider.network;
		this.currentPeer = this.currentNetwork.activePeer;
	}

	getPeerUrl() {
		return `http://${this.currentPeer.ip}:${this.currentPeer.port}`;
	}

	changePeer() {
		this.translateService
			.get("NETWORKS_PAGE.LOOKING_GOOD_PEER")
			.pipe(debounceTime(500))
			.subscribe(async (translate) => {
				this.loader = await this.loadingCtrl.create({
					message: translate,
					duration: 10000,
				});

				this.arkApiProvider
					.connectToRandomPeer()
					.pipe(
						takeUntil(this.unsubscriber$),
						catchError((e) => {
							this.loader.dismiss();
							this.toastProvider.error(
								e || "NETWORKS_PAGE.NO_GOOD_PEER",
							);
							return throwError(e);
						}),
					)
					.subscribe();

				await this.loader.present();
			});
	}

	ngOnInit() {
		this.onUpdatePeer();
		this.refreshData();

		this.refreshIntervalListener = setInterval(() => {
			this.refreshData();
		}, 30 * 1000);
	}

	ngOnDestroy() {
		clearInterval(this.refreshIntervalListener);

		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private refreshData() {
		this.arkApiProvider.client
			.getPeerConfig(this.currentPeer.ip, this.currentNetwork.p2pPort)
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((response) => {
				if (response) {
					this.zone.run(() => {
						this.currentPeer.version = response.data.version;
					});
				}
			});

		this.arkApiProvider.client
			.getPeerSyncing(this.getPeerUrl())
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((response) => {
				if (response) {
					this.zone.run(() => {
						this.currentPeer.height = response.height;
					});
				}
			});
	}

	private onUpdatePeer() {
		this.arkApiProvider.onUpdatePeer$
			.pipe(
				takeUntil(this.unsubscriber$),
				tap((peer) => {
					if (this.loader) {
						this.loader.dismiss();
					}
					this.translateService
						.get("NETWORKS_PAGE.PEER_SUCCESSFULLY_CHANGED")
						.subscribe((translate) =>
							this.toastProvider.success(translate),
						);
					this.zone.run(() => (this.currentPeer = peer));
					this.refreshData();
				}),
			)
			.subscribe();
	}
}
