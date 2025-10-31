// Gerenciamento de tweets
class TweetManager {
    constructor() {
        this.storage = storage;
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    createTweet(content) {
        const user = this.storage.getCurrentUser();
        
        if (content.length > 280) {
            throw new Error('Tweet muito longo! Máximo 280 caracteres.');
        }

        const tweet = {
            id: this.generateId(),
            content: content,
            author: {
                id: user.id,
                username: user.username,
                name: user.name,
                avatar: user.avatar
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            retweets: 0,
            comments: 0,
            liked: false,
            retweeted: false
        };

        return this.storage.saveTweet(tweet);
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        
        return date.toLocaleDateString('pt-BR');
    }

    extractHashtags(content) {
        const hashtagRegex = /#\w+/g;
        return content.match(hashtagRegex) || [];
    }

    extractMentions(content) {
        const mentionRegex = /@\w+/g;
        return content.match(mentionRegex) || [];
    }
}

// Instância global
const tweetManager = new TweetManager();
