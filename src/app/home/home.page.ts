import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Platform } from '@ionic/angular';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx'
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from "../componentes/modal/modal.component";
import { AlertController } from '@ionic/angular';



enum posiciones {
  INCLINADODERECHA,
  INCLINADOIZQUIERDA,
  VERTICAL,
  HORIZONTAL,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  x:string;
  y:string;
  z:string;
  timeSpam:string;
  id:any;
  posicion:posiciones;
  encendido = false;
  
  /* true si esta encendido false si no */
  audio: HTMLAudioElement;

  constructor(public navCtrl: NavController,
    private vibration: Vibration,
    private flashlight: Flashlight,
    private deviceMotion:DeviceMotion,
    private screenOrientation:ScreenOrientation,
    private modalController: ModalController,
    private platform: Platform,
    public alertController: AlertController
  ) {
    this.x=".";
    this.y=".";
    this.z=".";
    this.timeSpam="-";
  }

  async MostrarModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        'activado':this.encendido
      }
    });
    return await modal.present();
  }

  start(){
    
    try{
      var option:DeviceMotionAccelerometerOptions = 
      {
        frequency:200
      };
      this.id = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) =>
      {
        //Apoyado horizontalmente sobre una mesa
        this.x = ""+acc.x;
        this.y = ""+acc.y;
        this.z = ""+ acc.z;
        this.timeSpam= "" +acc.timestamp;

        //inclinado hacia la derecha
        if(acc.x >=-1 && acc.x <=1 && acc.y > 3 && acc.z >= 7 && this.posicion != posiciones.INCLINADODERECHA)
        {
          this.posicion = posiciones.INCLINADODERECHA;
          this.alarma1();
        }
        //inclinado hacia la izquierda
        else if(acc.x >=-1 && acc.x <= 1 && acc.y <-3 && acc.z >= 7 && this.posicion != posiciones.INCLINADOIZQUIERDA){
          this.posicion = posiciones.INCLINADOIZQUIERDA;
          this.alarma2();
        }
        //vertical (portraid)
        else if(acc.x >= -1 && acc.x <= 1 && acc.y >= 9 && acc.z >=-1 && acc.z <= 1 && this.posicion != posiciones.VERTICAL){
          this.posicion = posiciones.VERTICAL;
          this.alarma3();
        }
        //horizontal(landscape)
        else if(acc.x >= 9 && acc.y >= -1 && acc.y <= 1 && acc.z >= -1 && acc.z <= 1 && this.posicion != posiciones.HORIZONTAL){
          this.posicion = posiciones.HORIZONTAL;
          this.alarma4();
        }
      }
       )

    }
    catch(error){
      alert(error);
    }

  }
  stop(){
    this.audio.pause();
    this.id.unsubscribe();
  }

  alarma1(){
    this.audio = new Audio();
    this.audio.src = "./../assets/Quehaces.m4a";
    this.audio.load();
    this.audio.play();

  }
  alarma2(){
      this.audio = new Audio();
      this.audio.src = "./../assets/Estanrobando.m4a";
      this.audio.load();
      this.audio.play();      
  }
  alarma3(){
    this.audio = new Audio();
    this.audio.src = "./../assets/alarma.mp3";
    this.audio.load();
    this.flashlight= new Flashlight();
    this.flashlight.switchOn();
     this.audio.play();
      setTimeout(() => {
        this.audio.pause();
        this.flashlight.switchOff();
      }, 5000);    
  }
  alarma4(){

      this.vibration = new Vibration();
      this.vibration.vibrate(5000);
      this.audio = new Audio();
      this.audio.src = "./../assets/alarma.mp3";
      this.audio.load();
      this.audio.play();
      setTimeout(() => {
        this.audio.pause();
      }, 5000);      
      
      
  }


  ionViewDidEnter() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    this.backButtonEvent();
  }

  activarAlarma(encendido) {

    this.encendido = !encendido;
    console.log("Encendido:", encendido); 
    setTimeout( p => {
      this.MostrarModal();  
    }, 2000)
    

    if (this.encendido) {
      /* window.screen.orientation.addEventListener("change", this.changeOrientation); */
      this.start();
    }
    else {
      //mostrar modal de confirmacion.
      this.stop();
    }

  }

  backButtonEvent(){
    this.platform.backButton.subscribe(() => { 
      
      this.presentAlertConfirm();
    }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Decea salir de la aplicacion?',
      message: 'Hasta luego',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {            
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'SI',
          handler: () => {
            navigator["app"].exitApp();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
 

}
