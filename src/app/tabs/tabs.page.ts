import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"]
})
export class TabsPage {
  admin: Boolean = false;

  constructor(public auth: AngularFireAuth) {
    if (auth.auth.currentUser.email == "admin@admin.com") {
      this.admin = true;
    }
  }
}
