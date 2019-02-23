import { AuthMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EmailAlreadyExists } from "../../../lib/api/users/UsersApi";
import { IVerifyEmailUser } from "../interfaces";

export async function verifyUserEmailPromise(
  { apiUserService, notificationCenter }: TGlobalDependencies,
  userCode: IVerifyEmailUser,
  urlEmail: string,
  verifiedEmail: string,
): Promise<void> {
  if (urlEmail === verifiedEmail) {
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED));
    return;
  }
  if (!userCode) return;
  try {
    await apiUserService.verifyUserEmail(userCode);
    notificationCenter.info(createMessage(AuthMessage.AUTH_EMAIL_VERIFIED));
  } catch (e) {
    if (e instanceof EmailAlreadyExists)
      notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_ALREADY_EXISTS));
    else notificationCenter.error(createMessage(AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED));
  }
}
