export default interface ITokenService {
  getToken: (userId: string) => string
}
