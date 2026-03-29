import { EventEmitter } from 'events';

const blogEvents = new EventEmitter();
blogEvents.setMaxListeners(0); // no limit — one listener per SSE client

export default blogEvents;
