import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnrolmentServiceResultViewModel, FaceImageDataViewModel } from '../api/models';
import { EnrolmentService } from '../api/services';
import { FaceDetectionUtils } from '../utils/face-detection-utils';

declare var faceapi: any;

@Component({
  selector: 'app-face-enrolment',
  templateUrl: './face-enrolment.component.html',
  styleUrls: ['./face-enrolment.component.css'],
  providers: [MessageService],
})
export class FaceEnrolmentComponent implements OnInit {
  faceDetectionUtils: FaceDetectionUtils;

  public displayModal = false;
  public showProgress = false;
  public progress = 0;

  @ViewChild('inputVideo', { static: false }) inputVideo: ElementRef;
  @ViewChild('overlay', { static: false }) overlayCanvas: ElementRef;
  @ViewChild('imagesContainer', { static: false }) imagesContainer: ElementRef;

  capturedImages: string[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private enrolmentService: EnrolmentService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.faceDetectionUtils = new FaceDetectionUtils(this.video, this.overlay);

      this.faceDetectionUtils.initFaceDetector();
    });
  }

  canShowDeleteImageLabel(faceImages: FaceImageDataViewModel[]) {
    if (faceImages != undefined) {
      return faceImages.length > 0 && faceImages.every(e => e.id != undefined && e.image != undefined);
    }
    return false;
  }

  canDeleteImage(faceImage: FaceImageDataViewModel) {
    if (this.enableDelete) {
      if (faceImage) {
        if (faceImage.id && faceImage.image) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  @Input() faceImages: FaceImageDataViewModel[] = [];

  @Output() faceImagesChange = new EventEmitter();

  @Input() isFaceCaptured: boolean = false;
  @Output() isFaceCapturedChange = new EventEmitter();

  @Input() isSaveCompleted: boolean = false;
  @Input() faceEnrolmentResult: EnrolmentServiceResultViewModel;

  @Output() acceptSaveResult = new EventEmitter();

  @Input() enableDelete: boolean = false;

  get video() {
    return this.inputVideo.nativeElement;
  }

  get overlay() {
    return this.overlayCanvas.nativeElement;
  }

  public async captureImages(noOfImages: number) {
    this.showProgress = true;
    this.displayModal = true;
    this.progress = 0;
    setTimeout(async () => {
      await this.faceDetectionUtils.captureImages(noOfImages,
        p => this.progress = p,
        images => {
          this.showProgress = false;
          this.displayModal = false;
          this.faceImages = images.splice(0).map(img => {
            return {
              image: img.split(',')[1]
            }
          });
          this.faceImagesChange.emit(this.faceImages);

          this.isFaceCaptured = true;
          this.isFaceCapturedChange.emit(true);
        }
      );
    }, 1000);
  }

  refreshPage() {
    window.location.reload();
  }

  confirmDeleteFaceImage(faceImage: FaceImageDataViewModel) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete this face image?, Page will reload after deleting the image`,
      header: 'Sure to delete ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFaceImage(faceImage);
      },
      reject: () => {
      }
    });
  }

  deleteFaceImage(faceImage: FaceImageDataViewModel) {
    this.enrolmentService.deleteFaceData$Response({ faceId: faceImage.id }).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Face image deleted successfully',
          closable: true,
          sticky: false
        });
        this.refreshPage();
        this.faceImages = [...this.faceImages.filter(f => f.id != faceImage.id)];
        this.faceImagesChange.emit(this.faceImages);
      },
      error => {
        this.handleErrorResponse(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.faceDetectionUtils) this.faceDetectionUtils.stopVideoStream();
  }
  handleErrorResponse(errorResponse: any) {
    let msg = 'An error has occurred!';
    if (errorResponse.error.message) {
      msg = errorResponse.error.message;
    } else if (errorResponse.error) {
      msg = errorResponse.error;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: msg
    });
  }
}
