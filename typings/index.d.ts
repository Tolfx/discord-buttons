import discord, {
    Snowflake,
    Guild,
    Channel,
    User,
    GuildMember,
    Collector,
    CollectorFilter,
    Collection,
    CollectorOptions,
    APIMessageContentResolvable,
    MessageEmbed,
    MessageAttachment
} from 'discord.js';

declare module 'discord.js' {

    export interface ClientEvents
    {
        clickButton: [MessageComponent]
    }
    
    export interface MessageOptions
    {
        component?: MessageButton | MessageActionRow;
        components?: MessageActionRow[];
        button?: MessageButton | MessageButton[];
        buttons?: MessageButton | MessageButton[];
    }

    export interface Message
    {
        components: MessageActionRow[];
        createButtonCollector(
            filter: CollectorFilter,
            options?: AwaitMessageButtonOptions
        ): ButtonCollector;
        awaitButtons(
            filter: CollectorFilter,
            options?: AwaitMessageButtonOptions
        ): Promise<Collection<Snowflake, MessageComponent>>;
    }

    export interface WebhookClient
    {
        editMessage(message: string, content: any, options?: {}): Promise<any>;
        deleteMessage(message: string): Promise<void>;
        fetchMessage(message: string, cache?: boolean): Promise<any>;
    }
}

declare module 'discord-buttons' {
    export default function (client: discord.Client): void;

    export enum MessageComponentTypes {
        ACTION_ROW = 1,
        BUTTON = 2,
        SELECT_MENU = 3
    }
    
    export enum MessageButtonStyles {
        blurple = 1,
        grey = 2,
        green = 3,
        red = 4,
        url = 5,
    
        //Aliases
        gray = 2,
        PRIMARY = 1,
        SECONDARY = 2,
        SUCCESS = 3,
        DESTRUCTIVE = 4,
        LINK = 5
    }

    export enum MessageButtonStylesAliases {
        PRIMARY = 1,
        SECONDARY = 2,
        SUCCESS = 3,
        DESTRUCTIVE = 4,
        LINK = 5
    }
    
    export type MessageButtonStyle = keyof typeof MessageButtonStyles;
    
    export type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;
    
    export interface GuildButtonEmoji {
        name?: string,
        id?: Snowflake,
        animated?: boolean
    }
    
    export interface MessageButtonOptions {
        type: MessageComponentTypes.BUTTON,
        style: MessageButtonStyles | MessageButtonStylesAliases,
        label?: string,
        disabled?: boolean,
        emoji?: string | GuildButtonEmoji,
        url?: string,
        id?: string,
        custom_id?: string
    }
    
    export interface MessageButtonData {
        type?: MessageComponentTypes.BUTTON,
        style: MessageButtonStyles | MessageButtonStylesAliases | number,
        label?: string,
        disabled?: boolean,
        emoji?: GuildButtonEmoji,
        url?: string,
        custom_id?: string
    }
    
    export interface MessageActionRowData {
        type: number | string,
        components: MessageButton[]
    }
    
    export class MessageComponent {
        constructor(client: discord.Client, data: any);
        client: discord.Client;
        id: Snowflake;
        version: any;
        token: string;
        discordID: Snowflake;
        applicationID: Snowflake;
        guild: Guild;
        channel: Channel;
        clicker: {
            user: User;
            member: GuildMember;
            fetch: () => Promise<boolean>;
        };
        message: Message;
        webhook: WebhookClient;
        replied: boolean;
        deferred: boolean;
        defer(ephemeral?: boolean): Promise<void>;
        think(ephemeral?: boolean): Promise<void>;
        followUp(content: string, options?: {}): Promise<void>;
        get reply(): {
            send: (
                content: APIMessageContentResolvable | (ReplyOptions & { split?: false, ephemeral?: boolean }) | MessageAdditions,
            ) => Promise<any>;
            fetch: () => Promise<any>;
            edit: (content: any, options?: {}) => Promise<any>;
            delete: () => Promise<void>;
        };
    }
    
    export class BaseMessageComponent {
        static create(data: MessageActionRow | MessageButton): MessageActionRow | MessageButton;
        constructor(data: MessageActionRow | MessageButton);
    }
    
    export class MessageActionRow extends BaseMessageComponent {
        constructor(data?: {});
        setup(data: any): MessageActionRow;
        component: MessageButton;
        components: MessageButton[];
        addComponents(...components: MessageButton[]): MessageActionRow;
        addComponent(component: MessageButton): MessageActionRow;
        toJSON(): {
            components: MessageButton[];
            type: string | number;
        };
    }
    
    export class MessageButton extends BaseMessageComponent {
        constructor(data?: MessageButton | MessageButtonData | MessageButtonOptions);
        public setup(data: any): MessageButton;
        public style: MessageButtonStyles;
        public label: string;
        public disabled: boolean;
        public emoji: GuildButtonEmoji;
        public url: string;
        public custom_id: string;
        public setStyle(style: MessageButtonStyleResolvable): MessageButton;
        public setLabel(label: string): MessageButton;
        public setDisabled(disabled?: boolean): MessageButton;
        public setURL(url: string): MessageButton;
        public setID(id: string): MessageButton;
        public setEmoji(emoji: any): MessageButton;
        public toJSON(): MessageButtonData;
    }
    
    export interface MessageOptions extends discord.MessageOptions {
        component?: MessageButton | MessageActionRow;
        components?: MessageActionRow[];
        button?: MessageButton | MessageButton[];
        buttons?: MessageButton | MessageButton[];
    }
    
    export interface ReplyOptions extends MessageOptions {
        ephemeral?: boolean,
        flags?: number
    }
    
    export class WebhookClient extends discord.WebhookClient {
        editMessage(message: string, content: any, options?: {}): Promise<any>;
        deleteMessage(message: string): Promise<void>;
        fetchMessage(message: string, cache?: boolean): Promise<any>;
    }
    
    export interface Message extends discord.Message {
        components: MessageActionRow[];
        createButtonCollector(
            filter: CollectorFilter,
            options?: AwaitMessageButtonOptions
        ): ButtonCollector;
        awaitButtons(
            filter: CollectorFilter,
            options?: AwaitMessageButtonOptions
        ): Promise<Collection<Snowflake, MessageComponent>>;
    }
    
    export interface MessageButtonCollectorOptions extends CollectorOptions {
        max?: number;
        maxButtons?: number;
        maxUsers?: number;
    }
    
    export interface AwaitMessageButtonOptions extends MessageButtonCollectorOptions {
        errors?: string[];
    }
    
    export class ButtonCollector extends Collector<Snowflake, MessageComponent> {
        constructor(
            message: Message,
            filter: CollectorFilter,
            options?: MessageButtonCollectorOptions
        );
        message: Message;
        users: Collection<Snowflake, User>;
        total: number;
        empty(): void;
        endReason(): string | null;
        _handleChannelDeletion(channel: Channel): void;
        _handleGuildDeletion(guild: Guild): void;
        _handleMessageDeletion(message: Message): void;
    
        collect(button: MessageButton): Snowflake;
        dispose(button: MessageButton): Snowflake;
        on(
            event: 'collect' | 'dispose',
            listener: (interaction: MessageComponent) => Awaited<void>,
        ): this;
        on(
            event: 'end',
            listener: (collected: Collection<Snowflake, MessageComponent>, reason: string) => Awaited<void>,
        ): this;
        on(event: string, listener: (...data: any[]) => Awaited<void>): this;
    
        once(
            event: 'collect' | 'dispose',
            listener: (interaction: MessageComponent) => Awaited<void>,
        ): this;
        once(
            event: 'end',
            listener: (collected: Collection<Snowflake, MessageComponent>, reason: string) => Awaited<void>,
        ): this;
        once(event: string, listener: (...data: any[]) => Awaited<void>): this;
    }
    
    export type MessageAdditions = MessageEmbed | MessageAttachment | MessageButton | MessageActionRow | (MessageEmbed | MessageAttachment | MessageButton | MessageActionRow)[];
    
    export type Awaited<T> = T | Promise<T>;
    
    export interface ExtendedTextChannel extends discord.TextChannel {
        send(content: APIMessageContentResolvable | MessageAdditions | (MessageOptions & { split?: false; })): Promise<Message>;
    }
    
    export interface ExtendedDMChannel extends discord.DMChannel {
        send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    }
    
    export interface ExtendedNewsChannel extends discord.NewsChannel {
        send(content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions): Promise<Message>;
    }
}
