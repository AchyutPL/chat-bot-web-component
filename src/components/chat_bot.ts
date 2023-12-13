import { PayloadBody } from '../types';
import { generateUUID, scrollToBottom } from '../helpers';
import botHtml from '../templates/bot_html.html'
import User from '../assets/images/user.png';
import Bot from '../assets/images/bot.jpg';

const template = document.createElement('template');

template.innerHTML = botHtml;

class ChatBot extends HTMLElement {

    static observedAttributes = ["userImageSource", 'botImageSource'];

    apiUrl: string;

    conversationData: any[];

    loading: boolean;

    userImageSrc: string;

    botImageSrc: string;

    chatBotWrapper: HTMLDivElement | null;

    aiTriggerButton: HTMLButtonElement | null;

    inputField?: HTMLInputElement | null;

    questionAnswerSection: Element | null;

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.append(template.content.cloneNode(true));

        this.apiUrl = 'http://localhost:8000/conversation'; // add the api url conversation endpoint here

        this.conversationData = [];

        this.loading = false;

        this.userImageSrc = User;

        this.botImageSrc = Bot;

        this.inputEventFunc = this.inputEventFunc.bind(this);

        this.chatBotWrapper = shadowRoot.querySelector('.chat_bot_wrapper')

        this.aiTriggerButton = shadowRoot.querySelector('.ask_ai_button');

        this.inputField = shadowRoot.querySelector('.input_field')

        this.questionAnswerSection = shadowRoot.querySelector('.question_answer_section');
    }

    attributeChangedCallback(attrName: string, oldValue: string, newValue: string) {
        console.log('attrName', attrName);
    }

    public connectedCallback() {
        this.inputField?.addEventListener('keypress', this.inputEventFunc);
        const overLay = this.shadowRoot?.querySelector('.overlay') as HTMLDivElement;
        this.chatBotWrapper?.scrollTo({
            behavior: 'smooth',
            top: this.chatBotWrapper.scrollHeight
        });


        const handleDisplayProprty = () => {
            if (this.chatBotWrapper) {
                const chatBotWrapperDisplayProperty = this.chatBotWrapper.style.display;

                overLay.style.display = !overLay?.style.display || overLay?.style.display === 'none' ?
                    'block' :
                    'none';

                this.chatBotWrapper.style.display = !chatBotWrapperDisplayProperty || chatBotWrapperDisplayProperty === 'none' ?
                    'block' :
                    'none';
            }
        }

        this.aiTriggerButton?.addEventListener('click', (e) => {
            handleDisplayProprty()
        });

        overLay?.addEventListener('click', () => {
            handleDisplayProprty()
        })

        if (this.userImageSourceAttribute) this.userImageSrc = this.userImageSourceAttribute;

        if (this.botImageSourceAttribute) this.botImageSrc = this.botImageSourceAttribute;

        if (this.apiUrlttribute) this.apiUrl = this.apiUrlttribute;

    }

    public disconnectedCallback() {
        this.inputField?.removeEventListener('keypress', this.inputEventFunc);
    }

    private inputEventFunc(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.handleEnterClickOnInput(event)
        }
    }

    // Getter and setter for the "userImageSource" property
    get userImageSourceAttribute(): string | null {
        return this.getAttribute('userImageSource')
    }

    set userImageSourceAttribute(value: string) {
        this.setAttribute('userImageSource', value)
    }

    // Getter and setter for the "botImageSource" property
    get botImageSourceAttribute(): string | null {
        return this.getAttribute('userImageSource')
    }

    set botImageSourceAttribute(value: string) {
        this.setAttribute('userImageSource', value)
    }
    // Getter and setter for the "apiUrl" property
    get apiUrlttribute(): string | null {
        return this.getAttribute('userImageSource')
    }

    set apiUrlttribute(value: string) {
        this.setAttribute('userImageSource', value)
    }

    private async getAnswerFromConversationApi(body: PayloadBody) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: "text/event-stream",
                },
            })

            const loadingDiv = this.shadowRoot?.querySelector('.loading.ai_answer');

            if (loadingDiv?.parentElement) {
                loadingDiv.parentElement.removeChild(loadingDiv);
            }

            const reader = response?.body?.getReader();

            const uuid = 'css' + generateUUID();

            const className = `${uuid}`;

            this.renderMessasgeContent('', className, 'bot');

            const aiDiv = this.shadowRoot?.querySelector(`.${className}`);

            aiDiv?.classList.add('ai_answer')

            const paragraph = document.createElement('p');

            aiDiv?.appendChild(paragraph);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        // Handle end of the stream
                        break;
                    }
                    const deCodedChunk = new TextDecoder('utf-8').decode(value);

                    // Process the received data
                    paragraph.textContent += deCodedChunk;
                }
            }


        } catch (error) {
            console.log('Error fetching data', error);
            this.renderMessasgeContent('Error.', 'ai_answer', 'bot');
        }
    }

    private renderMessasgeContent(content: string, className: string, type: 'bot' | 'user') {
        if (!this.questionAnswerSection) {
            return;
        }
        const imageSrc = type === 'bot' ? this.botImageSrc : this.userImageSrc;

        this.questionAnswerSection.innerHTML +=  /* html */ `
                <div class="${className}">
                    <img src=${imageSrc} />
                     ${content && /* html */ `<p>${content}</p>`}
                </div>
        `;
    }

    private async handleEnterClickOnInput(event: KeyboardEvent) {
        if (!this.inputField) return;
        try {
            this.loading = true

            this.inputField.disabled = true;

            const question = (event?.target as HTMLInputElement).value;

            this.inputField.value = ''

            this.renderMessasgeContent(question, 'user_question', 'user');

            this.renderMessasgeContent('Analyzing...', 'loading ai_answer', 'bot');

            //instantly scroll to the question 
            scrollToBottom(this.chatBotWrapper);

            // start updading the scroll top in each 500ms
            const interval = setInterval(() => scrollToBottom(this.chatBotWrapper), 500);

            await this.getAnswerFromConversationApi({ question });

            this.loading = false

            this.inputField.disabled = false;

            return clearInterval(interval)

        } catch (error) {
            console.log('Error', error);

            this.loading = false

            this.inputField.disabled = false;
        }
    }
}

export default ChatBot;
