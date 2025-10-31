// Gerenciamento de dados local
class StorageManager {
    constructor() {
        this.tweetsKey = 'twitter-clone-tweets';
        this.usersKey = 'twitter-clone-users';
        this.currentUserKey = 'twitter-clone-current-user';
    }

    // Tweets
    getTweets() {
        return JSON.parse(localStorage.getItem(this.tweetsKey)) || [];
    }

    saveTweet(tweet) {
        const tweets = this.getTweets();
        tweets.unshift(tweet);
        localStorage.setItem(this.tweetsKey, JSON.stringify(tweets));
        return tweets;
    }

    deleteTweet(tweetId) {
        const tweets = this.getTweets().filter(tweet => tweet.id !== tweetId);
        localStorage.setItem(this.tweetsKey, JSON.stringify(tweets));
        return tweets;
    }

    likeTweet(tweetId) {
        const tweets = this.getTweets();
        const tweet = tweets.find(t => t.id === tweetId);
        if (tweet) {
            tweet.likes += 1;
            tweet.liked = true;
            localStorage.setItem(this.tweetsKey, JSON.stringify(tweets));
        }
        return tweets;
    }

    // Usuários
    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.currentUserKey)) || {
            id: '1',
            username: 'usuario',
            name: 'Usuário',
            avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
        };
    }

    setCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }
}

// Instância global
const storage = new StorageManager();
