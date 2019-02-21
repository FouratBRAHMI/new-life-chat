import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  @ViewChild(Slides) slides: Slides;
  role: string;
  password: string;
  profile = this.initProfile();
  conditions = false;
  file = {
    certif: null,
    id: null
  }

  humeurs = [
    { name: 'Enervé', img: 'Enerve' },
    { name: 'Seul', img: 'Seul' },
    { name: 'Heureux', img: 'Heureux' },
    { name: 'Détendu', img: 'Detendu' },
    { name: 'Confiant', img: 'Confiant' },
    { name: 'Amoureux', img: 'Amoureux' },
    { name: 'Fatigué', img: 'Fatigue' },
    { name: 'Triste', img: 'Triste' },
    { name: 'Apeuré', img: 'Apeure' }
  ];

  subjects = ['famille', 'sexualite', 'travail', 'couple', 'addictions', 'argent', 'divers'];
  selectedSubject: any = [];

  deps = ["Ain",
    "Aisne",
    "Allier",
    "Alpes-de-Haute-Provence",
    "Hautes-Alpes",
    "Alpes-Maritimes",
    "Ardèche",
    "Ardennes",
    "Ariège",
    "Aube",
    "Aude",
    "Aveyron",
    "Bouches-du-Rhône",
    "Calvados",
    "Cantal",
    "Charente",
    "Charente-Maritime",
    "Cher",
    "Corrèze",
    "Corse-du-Sud",
    "Haute-Corse",
    "Côte-d'Or",
    "Côtes-d'Armor",
    "Creuse",
    "Dordogne",
    "Doubs",
    "Drôme",
    "Eure",
    "Eure-et-Loir",
    "Finistère",
    "Gard",
    "Haute-Garonne",
    "Gers",
    "Gironde",
    "Hérault",
    "Ille-et-Vilaine",
    "Indre",
    "Indre-et-Loire",
    "Isère",
    "Jura",
    "Landes",
    "Loir-et-Cher",
    "Loire",
    "Haute-Loire",
    "Loire-Atlantique",
    "Loiret",
    "Lot",
    "Lot-et-Garonne",
    "Lozère",
    "Maine-et-Loire",
    "Manche",
    "Marne",
    "Haute-Marne",
    "Mayenne",
    "Meurthe-et-Moselle",
    "Meuse",
    "Morbihan",
    "Moselle",
    "Nièvre",
    "Nord",
    "Oise",
    "Orne",
    "Pas-de-Calais",
    "Puy-de-Dôme",
    "Pyrénées-Atlantiques",
    "Hautes-Pyrénées",
    "Pyrénées-Orientales",
    "Bas-Rhin",
    "Haut-Rhin",
    "DRhône",
    "MMétropole de Lyon",
    "Haute-Saône",
    "Saône-et-Loire",
    "Sarthe",
    "Savoie",
    "Haute-Savoie",
    "Paris",
    "Seine-Maritime",
    "Seine-et-Marne",
    "Yvelines",
    "Deux-Sèvres",
    "Somme",
    "Tarn",
    "Tarn-et-Garonne",
    "Var",
    "Vaucluse",
    "Vendée",
    "Vienne",
    "Haute-Vienne",
    "Vosges",
    "Yonne",
    "Territoire de Belfort",
    "Essonne",
    "Hauts-de-Seine",
    "Seine-Saint-Denis",
    "Val-de-Marne",
    "Val-d'Oise"
  ]

  classes = ["Agriculteurs exploitants",
    "Artisans",
    "Commerçants et assimilés",
    "Conseiller d’éducation",
    "Chefs d’entreprise",
    "Cadres administratifs et commerciaux d’entreprise",
    "Chômeurs",
    "Cadres de la Fonction publique, officier et élève officier des armées",
    "Employés civils et agents de service de la Fonction publique",
    "Employés administratifs d’entreprise",
    "Employés de commerce",
    "Ingénieurs et cadres techniques d’entreprise",
    "Instituteurs et assimilés, maître auxiliaire",
    "Médecin",
    "Militaires",
    "Ouvriers",
    "Policiers ",
    "Professeurs ",
    "Professions de l’information, des arts et des spectacles",
    "Professions libérales",
    "Professions intermédiaires de la santé et du travail social",
    "Retraités",
    "Techniciens",
    "Techniciens supérieurs",
    "Autres (inconnu ou sans objet) ",
  ]

  professionPro = [
    "Etudiant en master 2 psychologie", "psychologue"
  ]

  constructor(private navCtrl: NavController,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    //   private fileChooser: FileChooser,
    //   private file: File,
    // private filePath : FilePath,
    private camera: Camera
  ) {
  }

  isSubjectSelected(sub) {
    return this.selectedSubject.includes(sub);
  }

  selectThisSubject(sub) {
    if (!this.selectedSubject.includes(sub)) {
      this.selectedSubject.push(sub)
    } else if (this.selectedSubject.includes(sub)) {
      let index = this.selectedSubject.indexOf(sub, 0);
      if (index > -1) {
        this.selectedSubject.splice(index, 1);
      }
    }
  }

  private initProfile() {
    return {
      email: null,
      pseudo: null,
      sexe: null,
      birthday: null,
      profession: null,
      departement: null,
      humeur: null,
      nom: null,
      prenom: null,
      phone: null,
      philo: null
    };
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
  }

  openCGU() {
    this.iab.create('https://firebasestorage.googleapis.com/v0/b/lifechat-dev.appspot.com/o/CGU_LIFECHAT.pdf?alt=media', '_system')
  }

  chooseRole(role) {
    if (role != this.role)
      this.profile = this.initProfile();
    this.role = role;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
  }

  doRegister() {
    if (this.conditions) {
      let loader = this.loadingCtrl.create();
      loader.present();
      if (this.role == 'pro') {
        this.profile['themes'] = this.selectedSubject;
      } else {
        this.profile['msgCount'] = 0;
      }
      this.auth.register(this.profile.email, this.password, this.role, this.profile, this.file)
        .then(r => {
          this.navCtrl.setRoot('TabsPage')
            .then(() => loader.dismiss());
        })
        .catch(e => {
          this.toastCtrl.create({
            duration: 3000,
            message: e.message
          }).present();
          loader.dismiss();
        })
    }
  }

  openPopup(popup) {
    let message = '';
    if (popup == 'certif') {
      message = `
      - Si vous êtes étudiant, veuillez déposer votre certificat de scolarité<br>
      - Si vous êtes praticien, veuillez déposer votre diplôme le stipulant`
    } else {
      message = `
      Justicatifs d'identité acceptés:<br>
      - Carte d'identité<br>
      - Passport<br>
      - Permis de conduire<br>`
    }
    this.alertCtrl.create({
      message: message
    }).present();
  }

  onInputClick(type) {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(imageData => {
      this.file[type] = 'data:image/jpeg;base64,' + imageData;
    })
  }

}
