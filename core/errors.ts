export class CustomError extends Error {
  context: any

  date: Date

  constructor(message: string, context: any) {
    super(message)
    this.name = this.constructor.name
    this.context = context
    this.date = new Date()
  }
}
export class UnsupportedStoreError extends CustomError {}
export class UnsupportedUnit extends CustomError {}
export class FetchingError extends CustomError {}
export class ValidationError extends CustomError {
  constructor(errors: string[], context: any) {
    const message = errors.reduce((res, cur) => `${res}\n${cur}`, '')
    super(message, context)
  }
}

export type LogError = (error: CustomError) => void | Promise<void>
