declare var faceapi: any;

export class FaceDetectionUtils {

  private stream: MediaStream;

  private faceDetectorOptions: any;

  private faceDetector = faceapi.nets.tinyFaceDetector;

  private cropCanvas = document.createElement("canvas");
  private finalCropCanvas = document.createElement("canvas");

  private progressCallback: (progress: number) => void;
  private captureCompletedCallback: (capturedImages: string[]) => void;

  private noOfImagesToCapture = 0;

  private capturedImages: string[] = [];

  constructor(
    private video: any,
    private overlay: any,
    private inputSize = 320,
    private scoreThreshold = 0.65
  ) {
    this.faceDetectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: this.inputSize, scoreThreshold: this.scoreThreshold });
  }

  static async isMediaSupported(): Promise<boolean> {
    let error = null;

    try {
      if (navigator.mediaDevices) {
        const stream = await FaceDetectionUtils.getMediaStream();
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }
    } catch (err) {
      error = err;
    }

    if (!error)
      error = "Ensure that the page has been loaded using HTTPS protocol and the SSL certificate is valid.";

    console.error(error);
    return false;
  }

  private static async getMediaStream() {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });
  }

  private get isFaceDetectionModelLoaded() {
    return !!this.faceDetector.params;
  }

  public async initFaceDetector() {
    if (!this.isFaceDetectionModelLoaded) {
      await this.faceDetector.load('/assets/weights/');
    }
  }

  public async startVideoStream() {
    this.stream = await FaceDetectionUtils.getMediaStream();

    this.video.srcObject = this.stream;

    this.takeSnapshot();
  }

  public stopVideoStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.video.srcObject = null;
    }
  }

  public async captureImages(
    noOfImages: number,
    _progressCallback: (progress: number) => void,
    _captureCompletedCallback: (capturedImages: string[]) => void,
  ) {
    this.noOfImagesToCapture = noOfImages;
    this.progressCallback = _progressCallback;
    this.captureCompletedCallback = _captureCompletedCallback;

    await this.startVideoStream();
  }

  private async takeSnapshot() {

    const ctx1 = this.overlay.getContext('2d');
    ctx1.clearRect(0, 0, this.overlay.width, this.overlay.height);
    ctx1.beginPath();

    if (this.capturedImages.length === this.noOfImagesToCapture) {
      if (this.captureCompletedCallback)
        this.captureCompletedCallback(this.capturedImages);

      this.noOfImagesToCapture = 0;
      this.capturedImages = [];
      this.captureCompletedCallback = null;
      this.progressCallback = null;

      this.stopVideoStream();

      return;
    }

    if (this.video.paused || this.video.ended || !this.isFaceDetectionModelLoaded)
      this.scheduleNextSnapshot();

    const result = await faceapi.detectSingleFace(this.video, this.faceDetectorOptions);

    if (result) {
      const dims = faceapi.matchDimensions(this.overlay, this.video, true);

      const detections = faceapi.resizeResults(result, dims);

      faceapi.draw.drawDetections(this.overlay, detections);

      this.cropCanvas.width = this.overlay.width;
      this.cropCanvas.height = this.overlay.height;

      const ctx = this.cropCanvas.getContext('2d');

      ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
      ctx.beginPath();

      let det = result;

      var box = det.box;

      const x = Math.max(box.x - 75, 0);
      const y = Math.max(box.y - 75, 0);
      const w = Math.min(box.width + 150, this.cropCanvas.width);
      const h = Math.min(box.height + 150, this.cropCanvas.height);

      ctx.drawImage(this.video, x, y, w, h, 0, 0, w, h);

      this.finalCropCanvas.width = w;
      this.finalCropCanvas.height = h;

      const imgData = ctx.getImageData(0, 0, w, h);
      const ctx2 = this.finalCropCanvas.getContext('2d');
      ctx2.putImageData(imgData, 0, 0);

      this.capturedImages.push(this.finalCropCanvas.toDataURL("image/jpeg"));

      if (this.progressCallback) {
        const progress = parseInt(((this.capturedImages.length / this.noOfImagesToCapture) * 100).toString());

        this.progressCallback(progress);
      }
    }

    this.scheduleNextSnapshot();
  }

  private scheduleNextSnapshot() {
    setTimeout(() => this.takeSnapshot(), 150);
  }
}
