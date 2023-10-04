import { Component, OnInit } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  NumberValueAccessor,
  Validators,
} from '@angular/forms';
import { ActivationEnd } from '@angular/router';
import { ActionResponse } from 'src/app/shared/interfaces/action';
import { ActionService } from 'src/app/shared/services/action/action.service';

@Component({
  selector: 'app-admin-actions',
  templateUrl: './admin-actions.component.html',
  styleUrls: ['./admin-actions.component.scss'],
})
export class AdminActionsComponent {
  constructor(
    private actionservice: ActionService,
    private formBuilder: FormBuilder,
    private storsge: Storage
  ) {}

  public actions: Array<ActionResponse> = [];
  public actionForn!: FormGroup;
  public data = new Date().toLocaleDateString();
  public action_form = false;
  public edit_status = false;
  public uploadPercent!: number;
  private actionID!: number | string;

  ngOnInit(): void {
    this.initActionFoen();
    this.getACtiont();
  }

  initActionFoen(): void {
    this.actionForn = this.formBuilder.group({
      title: [null, Validators.required],
      motto: [null, Validators.required],
      description: [null, Validators.required],
      images: [null, Validators.required],
    });
  }

  getACtiont(): void {
    this.actionservice.getAll().subscribe((data) => {
      this.actions = data as ActionResponse[];
    });
  }

  creatAction() {
    if (this.edit_status) {
      this.actionservice
        .editAction(this.actionForn.value, this.actionID as string)
        .then(() => {
          this.getACtiont();
          this.uploadPercent = 0;
        });
    } else {
      this.actionservice.addAction(this.actionForn.value).then(() => {
        this.getACtiont();
        this.uploadPercent = 0;
      });
    }
    this.edit_status = false;
    this.action_form = false;
    this.actionForn.reset();
  }

  editAction(action: ActionResponse) {
    this.actionForn.patchValue({
      title: action.title,
      motto: action.motto,
      description: action.description,
      images: action.images,
    });
    this.action_form = true;
    this.edit_status = true;
    this.actionID = action.id;
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.loadFIle('images', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.actionForn.patchValue({
            images: data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storsge, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wtong file');
    }
    return Promise.resolve(url);
  }

  delAction(index: ActionResponse) {
    const task = ref(this.storsge, index.images);
    deleteObject(task);
    this.actionservice.delAction(index.id.toString()).then(() => {
      this.getACtiont();
    });
  }

  deleteImage(): void {
    const task = ref(this.storsge, this.valueByControl('images'));
    console.log(task);
        deleteObject(task).then(() => {
      this.uploadPercent = 0;
      this.actionForn.patchValue({
        images: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.actionForn.get(control)?.value;
  }
}
