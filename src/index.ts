import ChatBot from './components/chat_bot';

export interface ChatBotProps {
    // Add your attributes here
    userImageSource?: string;
    botImageSource?: number;
}


declare global {
    namespace JSX {
        interface IntrinsicElements {
            "atp-chat-bot": ChatBotProps;
        }
    }
}

// register the element here
customElements.define('atp-chat-bot', ChatBot);
