const Notification = require("../models/Notification");
const forumSocket = require("../websocket/forumSocket");

/** Creates a notification and pushes it to the recipient's live socket room. */
function createAndBroadcast({ userId, type, message, link }) {
    if (!userId) return null;
    const notification = Notification.create({ userId, type, message, link });
    forumSocket.pushNotification(notification);
    return notification;
}

/**
 * Create notifications for every @mention found in `text`.
 * Respects each recipient's in-app preference; returns the created list so
 * callers (REST or websocket) can push toasts to connected clients.
 */
function notifyMentions({ text, authorId, message, link }) {
    const pending = require("./mentionService").notifyMentions(text, authorId, { message, link });
    return pending
        .filter((item) => {
            const prefs = Notification.getPrefs(item.userId);
            return prefs.inApp !== false;
        })
        .map((item) =>
            createAndBroadcast({
                userId: item.userId,
                type: item.type,
                message: item.message,
                link: item.link
            })
        );
}

/**
 * Notify the discussion author when someone replies to their thread.
 */
function notifyReply({ discussionAuthorId, replierName, discussionId, discussionTitle }) {
    if (!discussionAuthorId) return null;
    const prefs = Notification.getPrefs(discussionAuthorId);
    if (prefs.inApp === false) return null;
    return createAndBroadcast({
        userId: discussionAuthorId,
        type: "reply",
        message: `${replierName} replied to "${discussionTitle}"`,
        link: `/forum/${discussionId}`
    });
}

/**
 * Notify the discussion author when their question is marked as solved.
 */
function notifySolved({ discussionAuthorId, solverName, discussionId, discussionTitle }) {
    if (!discussionAuthorId) return null;
    const prefs = Notification.getPrefs(discussionAuthorId);
    if (prefs.inApp === false) return null;
    return createAndBroadcast({
        userId: discussionAuthorId,
        type: "solved",
        message: `Your question "${discussionTitle}" was marked as solved by ${solverName}`,
        link: `/forum/${discussionId}`
    });
}

function listForUser(userId) {
    return Notification.listByUser(userId);
}

module.exports = { notifyMentions, notifyReply, notifySolved, listForUser };
