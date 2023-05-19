export interface PasswordRepository {
    encrypt(password: string): Promise<string>
}