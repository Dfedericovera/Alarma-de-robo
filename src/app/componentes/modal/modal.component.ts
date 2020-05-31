import { Component, OnInit ,Input} from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;
  @Input() activado:boolean;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.activado);
  }

  dismiss(){
    this.modalController.dismiss({
      'dismissed':true
    });
  }

}
