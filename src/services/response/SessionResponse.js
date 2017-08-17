class SessionResponse {
  code = 200;
  api_session = null;
  user = null;
  
  constructor(code, apiSession) {
    this.code = code;
    this.api_session = {
      sessionId: apiSession.id[0],
      webSessionId: apiSession.web_session_id[0]
    };
      
    if (apiSession.user) {
      let user = apiSession.user[0];
      apiSession.user = {
        username: user.username[0],
        id: user.id[0],
        email: user.email[0],
        firstname: user.firstname[0],
        lastname: user.lastname[0],
        language: { code: user.language[0]['$'], locale: user.language[0].value },
        avatarUrl: user.avatar_url[0]
      }
      this.user = apiSession.user;
    }
  }
}

export default SessionResponse;
