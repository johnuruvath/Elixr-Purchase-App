export const fetchHandler = async( {getState}, url: string, method : string, body: object) => {
    const state = getState();
    const jwt = state.auth.jwt;
    return await fetch(url, {
       method,
       headers: {
          "Content-Type": "application/json",
          "jwt": "bearer:"+jwt
       },
       body : method!== "GET" ? JSON.stringify(body) : null
    }).then(response => response.json())
}