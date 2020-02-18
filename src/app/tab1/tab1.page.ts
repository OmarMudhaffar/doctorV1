import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { NavigationExtras, Router } from "@angular/router";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  items: Array<any> = [];
  loading: Boolean = true;

  list: any[] = [
    {
      name: "عمر مظفر",
      img:
        "https://lh3.googleusercontent.com/proxy/1kZzF-meq08lAhyq21FRzpxsKqFD2cYF9XqG-S0jLD_WwEtPNaot7xqOPbFxooi7mDuk9fpPHYX77ebiluQHTPMul5bG_1HhvmaW-z1Hg7VUKqxphFlWHMVoEIYi6Vokvp3MIy3aAHBLLbwzLJdsx0VX",
      spel: "عضام"
    },

    {
      name: "تبارك محمد",
      img:
        "https://images.theconversation.com/files/304957/original/file-20191203-66986-im7o5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip",
      spel: "باطنية"
    }
  ];

  constructor(
    public alertController: AlertController,
    public auth: AngularFireAuth,
    public db: AngularFireDatabase,
    public router: Router
  ) {
    db.list("users", ref => ref.orderByChild("doctor").equalTo(true))
      .snapshotChanges()
      .subscribe(data => {
        this.loading = false;

        this.items = data;
      });
  }

  async logout() {
    const alert = await this.alertController.create({
      header: "خروج",
      message: "هل تريد تسجيل الخروج من التطبيق؟",
      buttons: [
        {
          text: "الغاء",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "خروج",
          handler: () => {
            this.auth.auth.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

  viewDoctor(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        img: item.payload.val()["img"],
        username: item.payload.val()["username"],
        fullname: item.payload.val()["fullname"],
        email: item.payload.val()["email"],
        spel: item.payload.val()["spel"],
        workname: item.payload.val()["workname"],
        lat: item.payload.val()["lat"],
        lng: item.payload.val()["lng"],
        about: item.payload.val()["about"]
      }
    };
    this.router.navigate(["/view-doctor"], navigationExtras);
  }
}
