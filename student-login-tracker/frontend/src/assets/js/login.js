const client = google.accounts.oauth2.initCodeClient({
    client_id: '353611842605-13fs4mq0qla4hd9mn3cu62d9ls85kh8u.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.email',
    ux_mode: 'redirect',
    redirect_uri: 'http://FRONTEND_HOST/loginSuccess.html',
});