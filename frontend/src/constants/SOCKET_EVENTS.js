/**
 * Author: Brandon Trundle
 * File Name: SOCKET_EVENTS.js
 * Date-Created: 4/26/2025
 * 
 * File Overview:
 * Centralized definitions of all WebSocket event names used across ArcanaTable.
 * Ensures consistency when emitting or listening to socket events.
 * 
 * Behavior:
 * - Each event key maps to the corresponding server-client event string.
 * - Used by both client and server for real-time communication.
 * 
 * Props:
 * - None (constant export).
 */

export const SOCKET_EVENTS = {
  JOIN_CAMPAIGN: 'join_campaign',         // Event for joining a campaign's socket.io room
  CHAT_MESSAGE: 'chat_message',           // Event for sending or receiving a chat message
  MAP_UPLOADED: 'map_uploaded',            // Event when a new campaign map is uploaded
  MAP_SETTINGS_UPDATED: 'map_settings_updated', // Event when GM changes map zoom/grid settings
  MAP_UPDATED: 'map_updated',              // Event when the campaign map image is updated
  DEBUG_PING: 'debug_ping',                // Event used for testing/debugging socket connectivity
  TOKEN_SPAWNED: 'token_spawned',           // ✅ NEW: Event when a token is placed on the board
};
