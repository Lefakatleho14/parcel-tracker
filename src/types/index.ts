/**
 * @file src/types/index.ts
 * @description All shared TypeScript types for the application.
 */

// ── ENUMS ──────────────────────────────────────────────────────────────────────

export enum ParcelStatus {
  PENDING           = 'PENDING',
  PICKED_UP         = 'PICKED_UP',
  IN_TRANSIT        = 'IN_TRANSIT',
  OUT_FOR_DELIVERY  = 'OUT_FOR_DELIVERY',
  DELIVERED         = 'DELIVERED',
  EXCEPTION         = 'EXCEPTION',
  RETURNED          = 'RETURNED',
}

// ── DOMAIN MODELS ──────────────────────────────────────────────────────────────

export interface TrackingEvent {
  event_id:        string
  tracking_number: string
  status:          ParcelStatus
  location:        string
  timestamp:       Date | string
}

export interface Parcel {
  tracking_number: string
  sender_name:     string
  receiver_name:   string
  status:          ParcelStatus
  created_at:      Date | string
}

export interface ParcelWithEvents extends Parcel {
  events: TrackingEvent[]
}

// ── API REQUEST SHAPES ─────────────────────────────────────────────────────────

export interface CreateParcelRequest {
  sender_name:   string
  receiver_name: string
}

export interface UpdateStatusRequest {
  status:     ParcelStatus
  location:   string
  timestamp?: string
}

// ── API RESPONSE SHAPES ────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  error:      string
  message:    string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data:       T[]
  pagination: {
    page:       number
    limit:      number
    total:      number
    totalPages: number
  }
}

export interface AdminParcelsQuery {
  status?: ParcelStatus
  page?:   number
  limit?:  number
}