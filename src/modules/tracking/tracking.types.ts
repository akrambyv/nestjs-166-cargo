export enum ShippingStatus {
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    IN_TRANSIT = 'in_transit',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    RETURNED = 'returned'
}

export interface ShippingHistoryItem {
    status: ShippingStatus;
    location: string;
    timestamp: Date;
    description: string;
}