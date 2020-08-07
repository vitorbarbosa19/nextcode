require('dotenv').config()
const axios = require('axios')

let nextCodeAuth = {
  token: null,
  exp: null,
}

const createHeader = () => ({ 'x-access-token': nextCodeAuth.token })

const login = async () => {
  const _url = 'https://auth.nxcd.com.br/v1.0/login/'
  const _body = {
    email: process.env.NEXTCODE_EMAIL,
    password: process.env.NEXTCODE_PASSWORD,
  }
  const { data } = await axios.post(_url, _body)
  const { token, exp } = data
  if (!token || !exp) {
    const error = 'NEXTCODE_LOGIN_ERROR'
    console.error(error, data)
    throw error
  }
  nextCodeAuth = { token, exp }
}

const verifyLogin = async () => {
  const { token, exp } = nextCodeAuth
  if (!token || exp < Date.now()) await login()
}

const analiseDocument = async () => {
  try {
    await verifyLogin()
    const _url = 'https://id.nxcd.com.br/v1.0/background-check/by-cnpj/28026371000161'
    const _config = { headers: createHeader() }
    const { data } = await axios.get(_url, _config)
    const { refresh, ...result } = data
    console.log(result.backgroundCheck._metadata)
  } catch (error) {
    console.log(error.response.data)
  }
}

analiseDocument()