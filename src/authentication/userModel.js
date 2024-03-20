import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: String,

        lastname: String,

        joined_date: Date,

        birth_date: Date,

        admin: {
            type: Boolean,
            required: true
        },
        manager: {
            type: Boolean,
            required: true
        },
        team_leader: {
            type: Boolean,
            required: true
        },
        employee: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', UserSchema)