import { AngularFireDatabase } from "@angular/fire/database";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NavController, ToastController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-view-doctor",
  templateUrl: "./view-doctor.page.html",
  styleUrls: ["./view-doctor.page.scss"]
})
export class ViewDoctorPage implements OnInit {
  info;
  loading: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public nav: NavController,
    public db: AngularFireDatabase,
    public auth: AngularFireAuth,
    public toast: ToastController
  ) {
    this.route.queryParams.subscribe(params => {
      this.info = params;
    });
  }

  goback() {
    this.nav.pop();
  }

  async toastPres() {
    let toast = await this.toast.create({
      message: "تم حجز الطبيب",
      duration: 2000
    });
    await toast.present();
  }

  book() {
    var d = new Date();

    const monthNames = [
      "يناير",
      "فبراير",
      "مارس",
      "ابريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر"
    ];

    this.loading = true;
    this.db
      .list("users", ref =>
        ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)
      )
      .valueChanges()
      .subscribe(data => {
        console.log(data);

        this.db
          .list("users", ref =>
            ref.orderByChild("email").equalTo(this.info.email)
          )
          .valueChanges()
          .subscribe(docInfo => {
            this.db
              .list("booking")
              .push({
                date:
                  d.getFullYear() +
                  "/" +
                  d.getDate() +
                  "/" +
                  monthNames[d.getMonth()],
                doctorName: this.info.fullname,
                doctorEmail: this.info.email,
                userName: data[0]["fullname"],
                userEmail: data[0]["email"],
                doctorAbout: docInfo[0]["about"],
                doctorSpel: docInfo[0]["spel"],
                workname: docInfo[0]["workname"]
              })
              .then(() => {
                this.toastPres();
                this.loading = false;
                this.router.navigate(["/home/tabs/tab2"]);
              })
              .catch(err => {
                this.loading = false;
              });
          });
      });
  }

  ngOnInit() {}
}
