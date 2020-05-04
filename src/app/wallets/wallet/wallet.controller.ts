import { Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { from, iif, Observable, of, throwError } from "rxjs";
import { catchError, mapTo, switchMap, tap } from "rxjs/operators";

import { Wallet, WalletKeys } from "@/models/model";
import { ToastProvider } from "@/services/toast/toast";

import { EnterSecondPassphraseModal } from "../../modals/enter-second-passphrase/enter-second-passphrase";

@Injectable({ providedIn: "root" })
export class WalletController {
	constructor(
		private modalCtrl: ModalController,
		private toastProvider: ToastProvider,
	) {}

	// TODO: Refactor
	public requestSecondPassphrase(
		wallet: Wallet,
		passphrases: WalletKeys,
	): Observable<WalletKeys> {
		const hasSecondPublicKey = !!(
			wallet.attributes?.secondPublicKey || wallet.secondPublicKey
		);
		if (hasSecondPublicKey && !wallet.cipherSecondKey) {
			return from(
				this.modalCtrl.create({
					component: EnterSecondPassphraseModal,
				}),
			).pipe(
				tap((modal) => modal.present()),
				switchMap((modal) =>
					from(modal.onDidDismiss()).pipe(
						switchMap((result) =>
							iif(
								() => !!result.data,
								of(result.data),
								throwError("ERROR"),
							),
						),
						catchError((e) => {
							this.toastProvider.error(
								"TRANSACTIONS_PAGE.SECOND_PASSPHRASE_NOT_ENTERED",
							);
							return throwError(e);
						}),
					),
				),
				tap(
					(passphrase) => (passphrases.secondPassphrase = passphrase),
				),
				mapTo(passphrases),
			);
		} else {
			return of(passphrases);
		}
	}
}
