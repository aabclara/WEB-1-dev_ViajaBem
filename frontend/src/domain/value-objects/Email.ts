import { EmailInvalidoError } from '../errors/EmailInvalidoError'

export class Email {
  private constructor(public readonly value: string) {}

  static create(raw: string): Email {
    if (!raw || !raw.includes('@') || raw.trim() !== raw || raw.length < 3) {
      throw new EmailInvalidoError(raw)
    }
    return new Email(raw.toLowerCase().trim())
  }

  toString(): string {
    return this.value
  }
}
