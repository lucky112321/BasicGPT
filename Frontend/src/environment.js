const server = import.meta.env.PROD ?
    "https://basicgpt-backend.onrender.com" :
    "http://localhost:8080";




export default server;