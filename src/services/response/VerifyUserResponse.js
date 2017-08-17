class VerifyUserResponse {

  code = 200;
  user = null;

  constructor(code, user) {
    this.code = code;
    this.user = { username: user.username[0],
                  web_session_id: user.web_session_id[0] };
  }
}

export default VerifyUserResponse;
