import { SocketIoConfig } from "ngx-socket-io/src/config/socket-io.config";
import { SelectListItem } from "../../viewModels/common/selectListItem";

export class AppConstants {
  public static itemsPerPage = 100;
  public static firstRowOffset = 0;
  public static defaultSoftOrder = 1;
  public static defaultMergeThresholdInSeconds = 10;
  public static SUPER_USER_ROLE_ID = 1;

  public static get baseURL(): string {
    return "/api/";
  }

  private static _baseWsUrl: string;

  public static enrolmentFaceAlreadyExistError: string = "Face already registered and failed to enroll the face, however enroler information is saved into database.";
  public static enrolmentCreatedSuccessFully: string = "Enrolment is successfully completed for Enroler";
  public static enrolmentUpdatedSuccessFully: string = "Enrolment has been updated successfully for Enroler!";
  public static enrolmentDeleted: string = "Enrolment has been deleted successfully!";

  public static reportCreated: string = "Report has been added successfully!";
  public static reportUpdated: string = "Report has been updated successfully!";
  public static roleCreated: string = "Role has been added successfully!";
  public static roleUpdated: string = "Role has been updated successfully!";
  public static userCreated: string = "User has been added successfully!";
  public static userUpdated: string = "User has been updated successfully!";

  public static getBaseWebSocketUrl(): string {
    if (!AppConstants._baseWsUrl) {
      const loc = window.location;
      const protocol = loc.protocol == 'https:' ? 'wss' : 'ws'
      AppConstants._baseWsUrl = protocol + "://" + loc.hostname + ":" + loc.port;
    }

    return AppConstants._baseWsUrl;
  }

  public static webSocketIoConfig: SocketIoConfig = {
    url: AppConstants.getBaseWebSocketUrl(),
    options: {},
  };
}
