export default interface ITokenProvider {
  getToken: (userId: string) => string
}
