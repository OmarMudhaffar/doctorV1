import { Component } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { AlertController, ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
  items: Array<any> = [];
  nodata: Boolean = false;
  constructor(
    public db: AngularFireDatabase,
    public auth: AngularFireAuth,
    public alert: AlertController,
    public toast: ToastController
  ) {
    auth.authState.subscribe(user => {
      if (user != undefined) {
        if (user.email != "admin@admin.com") {
          db.list("booking", ref =>
            ref.orderByChild("userEmail").equalTo(auth.auth.currentUser.email)
          )
            .snapshotChanges()
            .subscribe(data => {
              if (data.length == 0) {
                this.nodata = true;
              } else {
                this.nodata = false;
              }

              this.items = data;
            });
        } else {
          db.list("booking", ref =>
            ref.orderByChild("doctorEmail").equalTo(user.email)
          )
            .snapshotChanges()
            .subscribe(data => {
              if (data.length == 0) {
                this.nodata = true;
              } else {
                this.nodata = false;
              }

              this.items = data;
            });
        }
      }
    });
  }

  async toastPres() {
    let toast = await this.toast.create({
      message: "تم حذف الحجز",
      duration: 2000
    });
    await toast.present();
  }

  async delete(key) {
    let alert = await this.alert.create({
      subHeader: "حذف الحجز",
      message: "سيتم الغاء الحجز الخاص بك",
      buttons: [
        {
          text: "حذف",
          handler: () => {
            this.toastPres();
            this.db
              .list("booking")
              .remove(key)
              .then(() => {});
          }
        },
        {
          text: "الغاء",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        }
      ]
    });

    await alert.present();
  }
}
