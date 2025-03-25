const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    mobile_no: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    dob: {
        type: Date,
        required: true,
    },
    roleid: {
        type: Schema.Types.ObjectId,
        ref: "Roles",
        required: true,
    },
    plantId: {
        type: Schema.Types.ObjectId,
        ref: "Plant",
    },
    push_notification: [{
        enabled: { type: Boolean, default: false },        // Whether push notifications are enabled or not
        title: { type: String, default: "" },              // The title of the notification
        message: { type: String, default: "" },            // The message/content of the notification
        timestamp: { type: Date, default: Date.now },      // When the notification was sent
        sent: { type: Boolean, default: false },           // Whether the notification was sent
        notificationType: { type: String, default: "alert" },  // The type of notification
        read: { type: Boolean, default: false },           // Whether the notification is read
        payload: { type: Object, default: {} },            // Additional data related to the notification
        device: { type: String, default: "unknown" },      // Device type (e.g., "Android", "iOS")
        priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },  // Priority level
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Users", userSchema);
