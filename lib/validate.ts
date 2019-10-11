import logger from './logger'
import { Schema } from 'yup'

export default async function validate<T>(
  schema: Schema<T>,
  input: any,
): Promise<T> {
  const log = logger(__filename)

  try {
    if (await schema.isValid(input)) {
      return input
    } else {
      const error = new Error('Invalid input')
      log.error(error)
      throw error
    }
  } catch (error) {
    log.error(error)
    throw error
  }
}
