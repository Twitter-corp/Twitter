// Aplicação principal
class TwitterClone {
    constructor() {
        this.ui = ui;
        this.init();
    }

    init() {
        // Inicializar componentes da UI
        this.ui.renderHeader();
        this.ui.renderSidebar();
        this.ui.renderTimeline();
        this.ui.renderWidgets();
        this.ui.renderMobileNav();

        // Adicionar tweets de exemplo se não houver nenhum
        this.addSampleTweets();

        console.log('Twitter Clone inicializado!');
    }

    addSampleTweets() {
        const tweets = storage.getTweets();
        if (tweets.length === 0) {
            const sampleTweets = [
                "Acabando de criar meu Twitter Clone! 🚀 #TwitterClone #JavaScript",
                "Que tal postar seu primeiro tweet? 👇",
                "Bem-vindo ao Twitter Clone feito com HTML, CSS e JavaScript puro! ✨"
            ];

            sampleTweets.forEach(content => {
                tweetManager.createTweet(content);
            });
        }
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new TwitterClone();
});
