class RegisterResponse {

  code = 200;
  user = null;

  constructor(code, user) {
    this.code = code;
    this.user = { username: user.username[0],
                  web_session_id: user.web_session_id[0],
                  email: user.email[0],
                  id: user.id[0] };
  }
}

export default RegisterResponse;
