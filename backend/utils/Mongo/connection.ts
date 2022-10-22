import { Schema, model, connect } from 'mongoose'
import { Task, User } from '../../graphQL'
import { MONGO_URI } from '../../utils'

const taskSchema = new Schema<Task>({
  name: { type: String, required: true },
  done: { type: Boolean, required: true },
  userId: { type: String, required: true },
})

const userSchema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  calendarId: {type: String, required: false}
})

export const TaskModel = model<Task>('Task', taskSchema)
export const UserModel = model<User>('User', userSchema)

mainDB().catch(err => console.log(err))

export async function mainDB() {
  console.log('Connecting to MongoDB...')
  connect(MONGO_URI!)
  console.log(`Connected to ${MONGO_URI}`)
}
