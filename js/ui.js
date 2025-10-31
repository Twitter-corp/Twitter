// Gerenciamento de interface
class UIManager {
    constructor() {
        this.tweetManager = tweetManager;
        this.storage = storage;
    }

    // Renderização de componentes
    renderHeader() {
        const header = document.getElementById('header');
        header.innerHTML = `
            <div class="flex justify-between items-center p-4">
                <div class="flex items-center space-x-4">
                    <i class="fab fa-twitter text-blue-400 text-2xl"></i>
                    <div class="relative hidden md:block">
                        <input type="text" 
                               placeholder="Buscar no Twitter" 
                               class="bg-gray-800 rounded-full py-2 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="ui.showTweetModal()" class="btn-primary">
                        Tweetar
                    </button>
                    <div class="flex items-center space-x-2 cursor-pointer">
                        <img src="${this.storage.getCurrentUser().avatar}" 
                             alt="Avatar" 
                             class="w-8 h-8 rounded-full">
                    </div>
                </div>
            </div>
        `;
    }

    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuItems = [
            { icon: 'fas fa-home', text: 'Página Inicial', active: true },
            { icon: 'fas fa-hashtag', text: 'Explorar' },
            { icon: 'fas fa-bell', text: 'Notificações' },
            { icon: 'fas fa-envelope', text: 'Mensagens' },
            { icon: 'fas fa-bookmark', text: 'Itens salvos' },
            { icon: 'fas fa-user', text: 'Perfil' },
            { icon: 'fas fa-ellipsis-h', text: 'Mais' }
        ];

        sidebar.innerHTML = `
            <div class="space-y-2">
                ${menuItems.map(item => `
                    <div class="sidebar-item ${item.active ? 'font-bold' : ''}">
                        <i class="${item.icon} text-xl"></i>
                        <span class="text-xl">${item.text}</span>
                    </div>
                `).join('')}
                
                <button onclick="ui.showTweetModal()" class="btn-primary w-full mt-4">
                    Tweetar
                </button>
            </div>
        `;
    }

    renderTweetBox() {
        const user = this.storage.getCurrentUser();
        return `
            <div class="p-4 border-b border-gray-600">
                <div class="flex space-x-4">
                    <img src="${user.avatar}" 
                         alt="Avatar" 
                         class="w-12 h-12 rounded-full">
                    <div class="flex-1">
                        <textarea id="tweet-content" 
                                  placeholder="O que está acontecendo?" 
                                  class="input-tweet h-20"
                                  maxlength="280"></textarea>
                        <div class="flex justify-between items-center mt-4">
                            <div class="flex space-x-2 text-blue-400">
                                <i class="fas fa-image icon-hover"></i>
                                <i class="fas fa-poll icon-hover"></i>
                                <i class="fas fa-smile icon-hover"></i>
                                <i class="fas fa-calendar icon-hover"></i>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span id="char-count" class="text-gray-500">280</span>
                                <button onclick="ui.postTweet()" 
                                        id="tweet-button"
                                        class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full opacity-50 cursor-not-allowed">
                                    Tweetar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTweet(tweet) {
        const hashtags = this.tweetManager.extractHashtags(tweet.content);
        const mentions = this.tweetManager.extractMentions(tweet.content);
        
        let content = tweet.content;
        hashtags.forEach(tag => {
            content = content.replace(tag, `<span class="text-blue-400">${tag}</span>`);
        });
        mentions.forEach(mention => {
            content = content.replace(mention, `<span class="text-blue-400">${mention}</span>`);
        });

        return `
            <div class="tweet-card fade-in" data-tweet-id="${tweet.id}">
                <div class="flex space-x-3">
                    <img src="${tweet.author.avatar}" 
                         alt="${tweet.author.name}" 
                         class="w-12 h-12 rounded-full">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <span class="font-bold">${tweet.author.name}</span>
                            <span class="text-gray-500">@${tweet.author.username}</span>
                            <span class="text-gray-500">·</span>
                            <span class="text-gray-500">${this.tweetManager.formatTimestamp(tweet.timestamp)}</span>
                        </div>
                        <p class="mt-2 text-white">${content}</p>
                        <div class="flex justify-between mt-4 text-gray-500 max-w-md">
                            <button class="icon-hover group" onclick="ui.toggleLike('${tweet.id}')">
                                <i class="far fa-comment group-hover:text-blue-400"></i>
                                <span class="ml-2 group-hover:text-blue-400">${tweet.comments}</span>
                            </button>
                            <button class="icon-hover group" onclick="ui.retweet('${tweet.id}')">
                                <i class="fas fa-retweet group-hover:text-green-400"></i>
                                <span class="ml-2 group-hover:text-green-400">${tweet.retweets}</span>
                            </button>
                            <button class="icon-hover group" onclick="ui.toggleLike('${tweet.id}')">
                                <i class="${tweet.liked ? 'fas text-red-500' : 'far'} fa-heart group-hover:text-red-500"></i>
                                <span class="ml-2 group-hover:text-red-500">${tweet.likes}</span>
                            </button>
                            <button class="icon-hover group">
                                <i class="far fa-share-square group-hover:text-blue-400"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTimeline() {
        const timeline = document.getElementById('timeline');
        const tweets = this.storage.getTweets();
        
        timeline.innerHTML = `
            ${this.renderTweetBox()}
            <div id="tweets-container">
                ${tweets.map(tweet => this.renderTweet(tweet)).join('')}
            </div>
        `;

        this.setupTweetListeners();
    }

    renderWidgets() {
        const widgets = document.getElementById('widgets');
        widgets.innerHTML = `
            <div class="bg-gray-800 rounded-2xl p-4 mb-4">
                <h3 class="font-bold text-xl mb-4">O que está acontecendo</h3>
                <div class="space-y-4">
                    <div class="hover:bg-gray-700 p-2 rounded cursor-pointer">
                        <p class="text-gray-500 text-sm">Tendência no Brasil</p>
                        <p class="font-bold">#TwitterClone</p>
                        <p class="text-gray-500 text-sm">1.234 Tweets</p>
                    </div>
                    <div class="hover:bg-gray-700 p-2 rounded cursor-pointer">
                        <p class="text-gray-500 text-sm">Tendência no Brasil</p>
                        <p class="font-bold">JavaScript</p>
                        <p class="text-gray-500 text-sm">5.678 Tweets</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-800 rounded-2xl p-4">
                <h3 class="font-bold text-xl mb-4">Quem seguir</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between hover:bg-gray-700 p-2 rounded cursor-pointer">
                        <div class="flex items-center space-x-3">
                            <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" 
                                 alt="Avatar" 
                                 class="w-10 h-10 rounded-full">
                            <div>
                                <p class="font-bold">Dev JavaScript</p>
                                <p class="text-gray-500">@devjs</p>
                            </div>
                        </div>
                        <button class="btn-primary text-sm py-1 px-3">
                            Seguir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMobileNav() {
        const mobileNav = document.getElementById('mobile-nav');
        const navItems = [
            { icon: 'fas fa-home', active: true },
            { icon: 'fas fa-search' },
            { icon: 'fas fa-bell' },
            { icon: 'fas fa-envelope' }
        ];

        mobileNav.innerHTML = `
            <div class="flex justify-around items-center p-3">
                ${navItems.map(item => `
                    <button class="p-3 rounded-full ${item.active ? 'text-blue-400' : 'text-gray-400'}">
                        <i class="${item.icon} text-xl"></i>
                    </button>
                `).join('')}
            </div>
        `;
    }

    // Funcionalidades da UI
    setupTweetListeners() {
        const tweetContent = document.getElementById('tweet-content');
        const charCount = document.getElementById('char-count');
        const tweetButton = document.getElementById('tweet-button');

        if (tweetContent) {
            tweetContent.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = 280 - length;
                
                if (length > 0 && length <= 280) {
                    tweetButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    tweetButton.classList.add('opacity-100', 'cursor-pointer');
                } else {
                    tweetButton.classList.add('opacity-50', 'cursor-not-allowed');
                    tweetButton.classList.remove('opacity-100', 'cursor-pointer');
                }
            });
        }
    }

    async postTweet() {
        const tweetContent = document.getElementById('tweet-content');
        const content = tweetContent.value.trim();

        if (content.length === 0 || content.length > 280) {
            return;
        }

        try {
            const tweets = this.tweetManager.createTweet(content);
            this.renderTimeline();
            tweetContent.value = '';
            this.updateCharCount();
        } catch (error) {
            alert(error.message);
        }
    }

    updateCharCount() {
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '280';
        }
    }

    toggleLike(tweetId) {
        const tweets = this.storage.likeTweet(tweetId);
        this.renderTimeline();
    }

    retweet(tweetId) {
        // Implementar funcionalidade de retweet
        console.log('Retweet:', tweetId);
    }

    showTweetModal() {
        const modals = document.getElementById('modals');
        modals.innerHTML = `
            <div class="modal-overlay" onclick="ui.hideTweetModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="flex justify-between items-center mb-4">
                        <button onclick="ui.hideTweetModal()" class="text-gray-500 hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    ${this.renderTweetBox()}
                </div>
            </div>
        `;
        this.setupTweetListeners();
    }

    hideTweetModal() {
        const modals = document.getElementById('modals');
        modals.innerHTML = '';
    }
}

// Instância global
const ui = new UIManager();
